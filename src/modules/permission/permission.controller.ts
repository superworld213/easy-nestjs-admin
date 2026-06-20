import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminUser, Menu, Role } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:permission')
@Controller('admin/permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get('menus')
  menus(@CurrentUser() user: AdminUser): Promise<Menu[]> {
    return this.service.currentUserMenus(user);
  }

  @Get('roles')
  roles(@CurrentUser() user: AdminUser): Promise<Role[]> {
    return this.service.currentUserRoles(user);
  }

  @Post('update')
  async update(@CurrentUser() user: AdminUser, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateCurrentUser(user, body);
    return [];
  }
}
