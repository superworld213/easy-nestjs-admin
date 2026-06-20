import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { createHash, randomUUID } from 'node:crypto';
import { IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { AdminUser } from '../../common/types/entities';
import { AdminUserEntity } from '../../database/entities/admin-user.entity';
import { AuthTokenEntity, AuthTokenType } from '../../database/entities/auth-token.entity';
import { UserLoginLogEntity } from '../../database/entities/user-login-log.entity';

export interface PassportTokens {
  access_token: string;
  refresh_token: string;
  expire_at: number;
}

@Injectable()
export class AuthService {
  private readonly accessTokenTtl = Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 7200);
  private readonly refreshTokenTtl = Number(process.env.REFRESH_TOKEN_TTL_SECONDS ?? 604800);

  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly userRepo: Repository<AdminUserEntity>,
    @InjectRepository(AuthTokenEntity)
    private readonly tokenRepo: Repository<AuthTokenEntity>,
    @InjectRepository(UserLoginLogEntity)
    private readonly loginLogRepo: Repository<UserLoginLogEntity>,
  ) {}

  async login(
    username: string,
    password: string,
    requestMeta: { ip?: string; browser?: string; os?: string },
  ): Promise<PassportTokens> {
    const user = await this.userRepo.findOneBy({ username });
    const verified = user ? await this.verifyPassword(password, user.password) : false;
    if (!user || !verified) {
      await this.loginLogRepo.save(
        this.loginLogRepo.create({
          username,
          ip: requestMeta.ip ?? '0.0.0.0',
          os: requestMeta.os ?? 'unknown',
          browser: requestMeta.browser ?? 'unknown',
          status: 2,
          message: 'Invalid username or password',
          login_time: new Date(),
        }),
      );
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.status === 2) {
      await this.loginLogRepo.save(
        this.loginLogRepo.create({
          username: user.username,
          ip: requestMeta.ip ?? '0.0.0.0',
          os: requestMeta.os ?? 'unknown',
          browser: requestMeta.browser ?? 'unknown',
          status: 2,
          message: 'User disabled',
          login_time: new Date(),
        }),
      );
      throw new UnauthorizedException('User disabled');
    }

    user.login_ip = requestMeta.ip ?? '0.0.0.0';
    user.login_time = new Date();
    await this.userRepo.save(user);
    await this.loginLogRepo.save(
      this.loginLogRepo.create({
        username,
        ip: user.login_ip,
        os: requestMeta.os ?? 'unknown',
        browser: requestMeta.browser ?? 'unknown',
        status: 1,
        message: 'Login success',
        login_time: user.login_time,
      }),
    );

    void this.cleanupExpiredTokens().catch(() => undefined);
    return this.issueTokens(user.id);
  }

  async logout(accessToken: string | undefined): Promise<void> {
    if (!accessToken) {
      return;
    }

    const session = await this.tokenRepo.findOne({
      where: {
        token_hash: this.hashToken(accessToken),
        token_type: 'access',
      },
    });

    if (session) {
      await this.revokeSession(session.session_id);
      return;
    }

    await this.tokenRepo.update(
      {
        token_hash: this.hashToken(accessToken),
        revoked_at: IsNull(),
      },
      { revoked_at: new Date() },
    );
  }

  async refresh(refreshToken: string | undefined): Promise<PassportTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const session = await this.tokenRepo.findOne({
      where: {
        token_hash: this.hashToken(refreshToken),
        token_type: 'refresh',
        revoked_at: IsNull(),
        expires_at: MoreThan(new Date()),
      },
    });
    if (!session) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.revokeSession(session.session_id);
    return this.issueTokens(session.user_id);
  }

  async resolveAccessToken(accessToken: string | undefined): Promise<AdminUser | undefined> {
    if (!accessToken) {
      return undefined;
    }

    const session = await this.tokenRepo.findOne({
      where: {
        token_hash: this.hashToken(accessToken),
        token_type: 'access',
        revoked_at: IsNull(),
        expires_at: MoreThan(new Date()),
      },
    });
    if (!session) {
      return undefined;
    }

    const user = await this.userRepo.findOneBy({ id: session.user_id });
    if (!user || user.status === 2) {
      await this.revokeSession(session.session_id);
      return undefined;
    }

    void this.tokenRepo.update(session.id, { last_used_at: new Date() }).catch(() => undefined);
    return user as unknown as AdminUser;
  }

  getBearerToken(authorization: string | undefined): string | undefined {
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');
    return scheme?.toLowerCase() === 'bearer' ? token : undefined;
  }

  toPublicUser(user: AdminUser): Omit<AdminUser, 'password'> {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!hash) {
      return false;
    }

    if (!hash.startsWith('$2')) {
      return password === hash;
    }

    return compare(password, hash.replace(/^\$2y\$/, '$2b$'));
  }

  private async issueTokens(userId: number): Promise<PassportTokens> {
    const sessionId = randomUUID();
    const accessToken = this.createToken('access', userId, sessionId);
    const refreshToken = this.createToken('refresh', userId, sessionId);
    const now = Date.now();

    await this.tokenRepo.save([
      this.tokenRepo.create({
        user_id: userId,
        session_id: sessionId,
        token_hash: this.hashToken(accessToken),
        token_type: 'access',
        expires_at: new Date(now + this.accessTokenTtl * 1000),
      }),
      this.tokenRepo.create({
        user_id: userId,
        session_id: sessionId,
        token_hash: this.hashToken(refreshToken),
        token_type: 'refresh',
        expires_at: new Date(now + this.refreshTokenTtl * 1000),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expire_at: this.accessTokenTtl,
    };
  }

  private createToken(type: AuthTokenType, userId: number, sessionId: string): string {
    const payload = Buffer.from(
      JSON.stringify({
        sub: userId,
        typ: type,
        sid: sessionId,
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString('base64url');

    return `mineadmin.${payload}.${randomUUID()}`;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async revokeSession(sessionId: string): Promise<void> {
    await this.tokenRepo.update(
      {
        session_id: sessionId,
        revoked_at: IsNull(),
      },
      { revoked_at: new Date() },
    );
  }

  private async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepo.delete({ expires_at: LessThanOrEqual(new Date()) });
  }
}
