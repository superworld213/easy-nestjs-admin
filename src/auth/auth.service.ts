import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      select: { id: true, username: true, password: true, status: true, nickname: true },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === UserStatus.DISABLE) {
      throw new UnauthorizedException('用户已停用');
    }

    const tokens = await this.generateTokens(user.id);

    await this.userRepo.update(user.id, {
      login_ip: '',
      login_time: new Date(),
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    };
  }

  async refresh(userId: number) {
    return this.generateTokens(userId);
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: { menus: true }, departments: true, positions: { department: true } },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.status === UserStatus.DISABLE) {
      throw new UnauthorizedException('用户已停用');
    }

    const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
    const permissions = isSuperAdmin
      ? ['*']
      : [...new Set(user.roles?.flatMap((r) => r.menus?.map((m) => m.name) ?? []) ?? [])];

    return {
      ...user,
      password: undefined,
      isSuperAdmin,
      permissions,
    };
  }

  async generateTokens(userId: number) {
    const payload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES', '1h'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES', '2h'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
