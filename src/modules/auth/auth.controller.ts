import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AdminUser } from '../../common/types/entities';
import { LoginDto } from './dto/login.dto';
import { AuthService, PassportTokens } from './auth.service';

@ApiTags('admin:passport')
@Controller('admin/passport')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() request: Request): Promise<PassportTokens> {
    return this.authService.login(dto.username, dto.password, {
      ip: request.ip,
      browser: request.headers['user-agent'],
      os: String(request.headers['sec-ch-ua-platform'] ?? 'unknown'),
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@Headers('authorization') authorization?: string): [] {
    this.authService.logout(this.authService.getBearerToken(authorization));
    return [];
  }

  @ApiBearerAuth()
  @Get('getInfo')
  getInfo(@CurrentUser() user: AdminUser): Partial<AdminUser> {
    return {
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      signed: user.signed,
      backend_setting: user.backend_setting,
      phone: user.phone,
      email: user.email,
      dashboard: user.dashboard,
      login_ip: user.login_ip,
      login_time: user.login_time,
    };
  }

  @Public()
  @ApiBearerAuth()
  @Post('refresh')
  refresh(@Headers('authorization') authorization?: string): PassportTokens {
    return this.authService.refresh(this.authService.getBearerToken(authorization));
  }
}
