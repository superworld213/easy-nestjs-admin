import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';

import { AdminUser, TokenSession } from '../../common/types/entities';
import { AdminUserEntity } from '../../database/entities/admin-user.entity';
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
  private readonly accessTokens = new Map<string, TokenSession>();
  private readonly refreshTokens = new Map<string, TokenSession>();

  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly userRepo: Repository<AdminUserEntity>,
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

    return this.issueTokens(user.id);
  }

  logout(accessToken: string | undefined): void {
    if (accessToken) {
      this.accessTokens.delete(accessToken);
    }
  }

  refresh(refreshToken: string | undefined): PassportTokens {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const session = this.refreshTokens.get(refreshToken);
    if (!session || session.expiresAt <= Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    this.refreshTokens.delete(refreshToken);
    return this.issueTokens(session.userId);
  }

  async resolveAccessToken(accessToken: string | undefined): Promise<AdminUser | undefined> {
    const session = accessToken ? this.accessTokens.get(accessToken) : undefined;
    if (!session || session.expiresAt <= Date.now()) {
      return undefined;
    }

    const user = await this.userRepo.findOneBy({ id: session.userId });
    if (!user || user.status === 2) {
      return undefined;
    }

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

  private issueTokens(userId: number): PassportTokens {
    const accessToken = this.createToken('access', userId);
    const refreshToken = this.createToken('refresh', userId);
    const now = Date.now();

    this.accessTokens.set(accessToken, {
      userId,
      tokenType: 'access',
      expiresAt: now + this.accessTokenTtl * 1000,
    });
    this.refreshTokens.set(refreshToken, {
      userId,
      tokenType: 'refresh',
      expiresAt: now + this.refreshTokenTtl * 1000,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expire_at: this.accessTokenTtl,
    };
  }

  private createToken(type: 'access' | 'refresh', userId: number): string {
    const payload = Buffer.from(
      JSON.stringify({
        sub: userId,
        typ: type,
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString('base64url');

    return `mineadmin.${payload}.${randomUUID()}`;
  }
}
