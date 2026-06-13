import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserStatus } from '../entities/user.entity';
import { Menu } from '../entities/menu.entity';
import { IsString, IsOptional } from 'class-validator';

class UpdateProfileDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  signed?: string;
}

@Controller('permission')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() currentUser: { id: number }) {
    const user = await this.userRepo.findOne({
      where: { id: currentUser.id },
      relations: { roles: { menus: true }, departments: true, positions: { department: true } },
    });

    if (!user) {
      return { code: 401, message: '用户不存在' };
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

  @Get('menus')
  async getMenus(@CurrentUser() currentUser: { id: number }) {
    const user = await this.userRepo.findOne({
      where: { id: currentUser.id },
      relations: { roles: { menus: true } },
    });

    if (!user) return [];

    const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;

    let menus: Menu[];
    if (isSuperAdmin) {
      menus = await this.menuRepo.find({
        where: { status: UserStatus.NORMAL },
        order: { sort: 'ASC' },
      });
    } else {
      const permissionNames = [
        ...new Set(user.roles?.flatMap((r) => r.menus?.map((m) => m.name) ?? []) ?? []),
      ];
      if (permissionNames.length === 0) return [];
      menus = await this.menuRepo
        .createQueryBuilder('menu')
        .where('menu.status = :status', { status: UserStatus.NORMAL })
        .andWhere('menu.name IN (:...names)', { names: permissionNames })
        .orderBy('menu.sort', 'ASC')
        .getMany();
    }

    return this.buildTree(menus);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() currentUser: { id: number },
    @Body() dto: UpdateProfileDto,
  ) {
    await this.userRepo.update(currentUser.id, dto);
    return { message: '更新成功' };
  }

  private buildTree(menus: Menu[], parentId = 0): any[] {
    return menus
      .filter((m) => m.parent_id === parentId)
      .map((m) => ({
        ...m,
        children: this.buildTree(menus, m.id),
      }));
  }
}
