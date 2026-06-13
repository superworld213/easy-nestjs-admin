import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSION_KEY, PermissionOptions } from '../decorators/permission.decorator';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<PermissionOptions>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('未授权访问');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });

    if (!user || user.status === 2) {
      throw new ForbiddenException('用户已停用');
    }

    const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
    if (isSuperAdmin) {
      return true;
    }

    const codes = Array.isArray(permission.code) ? permission.code : [permission.code];
    const { operation = 'and' } = permission;

    const hasPermission = await this.checkPermission(userId, codes, operation);

    if (!hasPermission) {
      throw new ForbiddenException('无权访问');
    }

    return true;
  }

  private async checkPermission(
    userId: number,
    codes: string[],
    operation: 'and' | 'or',
  ): Promise<boolean> {
    const userRoles = await this.roleRepo
      .createQueryBuilder('role')
      .innerJoin('user_belongs_role', 'ubr', 'ubr.role_id = role.id')
      .innerJoin('role_belongs_menu', 'rbm', 'rbm.role_id = role.id')
      .innerJoin('menu', 'menu', 'menu.id = rbm.menu_id')
      .where('ubr.user_id = :userId', { userId })
      .andWhere('role.status = 1')
      .andWhere('menu.name IN (:...codes)', { codes })
      .select('DISTINCT menu.name', 'name')
      .getRawMany();

    const matchedCodes = new Set(userRoles.map((r) => r.name));

    if (operation === 'and') {
      return codes.every((code) => matchedCodes.has(code));
    }

    return codes.some((code) => matchedCodes.has(code));
  }
}
