import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, SetMenusDto } from './dto/role.dto';

@Controller('permission/roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permission('permission:role:index')
  async page(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('name') name?: string,
    @Query('status') status?: number,
  ) {
    return this.roleService.page({ page, pageSize, name, status });
  }

  @Post()
  @Permission('permission:role:save')
  async create(@Body() dto: CreateRoleDto, @CurrentUser() user: { id: number }) {
    return this.roleService.create(dto, user.id);
  }

  @Put(':id')
  @Permission('permission:role:update')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.roleService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Permission('permission:role:delete')
  async delete(@Param('id') id: number) {
    return this.roleService.delete(id);
  }

  @Get(':id/menus')
  @Permission('permission:role:getMenu')
  async getMenus(@Param('id') id: number) {
    return this.roleService.getMenus(id);
  }

  @Put(':id/menus')
  @Permission('permission:role:setMenu')
  async setMenus(@Param('id') id: number, @Body() dto: SetMenusDto) {
    return this.roleService.setMenus(id, dto.menuIds);
  }
}
