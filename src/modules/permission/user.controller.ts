import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AdminUser, PageList, Role } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:user')
@Controller('admin/user')
export class UserController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:user:index')
  page(@Query() query: PaginationQueryDto): Promise<PageList<AdminUser>> {
    return this.service.pageUsers(query);
  }

  @Post()
  @Permission('permission:user:save')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createUser(body);
    return [];
  }

  @Put('info')
  @Permission('permission:user:update')
  async updateInfoAlias(@CurrentUser() user: AdminUser, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateUser(user.id, { ...body, password: undefined });
    return [];
  }

  @Put()
  @Permission('permission:user:update')
  async updateInfo(@CurrentUser() user: AdminUser, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateUser(user.id, { ...body, password: undefined });
    return [];
  }

  @Put('password')
  @Permission('permission:user:password')
  async resetPassword(@Body('id') id: number): Promise<[]> {
    await this.service.resetUserPassword(Number(id));
    return [];
  }

  @Delete()
  @Permission('permission:user:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteUsers(body);
    return [];
  }

  @Put(':id')
  @Permission('permission:user:update')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateUser(id, body);
    return [];
  }

  @Get(':id/roles')
  @Permission('permission:user:getRole')
  getUserRoles(@Param('id', ParseIntPipe) id: number): Promise<Role[]> {
    return this.service.getUserRoles(id);
  }

  @Put(':id/roles')
  @Permission('permission:user:setRole')
  async setUserRoles(@Param('id', ParseIntPipe) id: number, @Body('role_codes') roleCodes: string[]): Promise<[]> {
    await this.service.setUserRoles(id, roleCodes ?? []);
    return [];
  }
}
