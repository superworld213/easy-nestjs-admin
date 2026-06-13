import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
export declare class PermissionGuard implements CanActivate {
    private readonly reflector;
    private readonly userRepo;
    private readonly roleRepo;
    constructor(reflector: Reflector, userRepo: Repository<User>, roleRepo: Repository<Role>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private checkPermission;
}
