import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DATA_SCOPE_KEY, DataScopeOptions } from '../decorators/data-scope.decorator';
import { DataPermissionService } from '../data-permission.service';

@Injectable()
export class DataScopeInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataPermissionService: DataPermissionService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.getAllAndOverride<DataScopeOptions>(DATA_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      return next.handle();
    }

    request.dataScope = {
      ...options,
      userId,
      applyDataScope: (qb: any, currentTable?: string) => {
        return this.dataPermissionService.applyDataScope(qb, userId, {
          ...options,
          currentTable,
        });
      },
    };

    return next.handle();
  }
}
