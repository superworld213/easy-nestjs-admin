import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { AdminUser } from '../types/entities';
import { LogstashService } from '../../modules/logstash/logstash.service';

interface RequestWithUser extends Request {
  user?: AdminUser;
}

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logstashService: LogstashService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const permission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!this.shouldLog(request, permission)) {
      return next.handle();
    }

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.writeLog(request, permission, startedAt),
        error: (error: Error) => this.writeLog(request, permission, startedAt, error),
      }),
    );
  }

  private shouldLog(request: RequestWithUser, permission?: string): boolean {
    if (!request.user || this.isPassportRoute(request)) {
      return false;
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method.toUpperCase())) {
      return true;
    }

    return Boolean(permission && (process.env.LOG_READ_REQUESTS ?? 'false') === 'true');
  }

  private writeLog(
    request: RequestWithUser,
    permission: string | undefined,
    startedAt: number,
    error?: Error,
  ): void {
    const duration = Date.now() - startedAt;
    const remark = error
      ? `failed in ${duration}ms: ${error.message}`
      : `completed in ${duration}ms`;

    void this.logstashService
      .recordOperation({
        username: request.user?.username ?? 'unknown',
        method: request.method.toUpperCase(),
        router: request.originalUrl ?? request.url,
        serviceName: permission ?? `${request.method.toUpperCase()} ${request.path}`,
        ip: this.clientIp(request),
        remark,
      })
      .catch(() => undefined);
  }

  private isPassportRoute(request: RequestWithUser): boolean {
    return (request.path || request.url).startsWith('/admin/passport');
  }

  private clientIp(request: RequestWithUser): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0] ?? request.ip ?? '';
    }
    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return forwardedFor.split(',')[0].trim();
    }
    return request.ip ?? '';
  }
}
