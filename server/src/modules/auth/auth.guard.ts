import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY } from '../../common/decorators/permission.decorator';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { RequestWithUser } from '../../common/decorators/current-user.decorator';
import { PermissionService } from '../permission/permission.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.authService.getBearerToken(request.headers.authorization);
    const user = await this.authService.resolveAccessToken(token);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.user = user;

    const permission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (permission && !(await this.permissionService.hasPermission(user.id, permission))) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
