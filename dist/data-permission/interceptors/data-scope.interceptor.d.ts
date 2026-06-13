import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataPermissionService } from '../data-permission.service';
export declare class DataScopeInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly dataPermissionService;
    constructor(reflector: Reflector, dataPermissionService: DataPermissionService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
