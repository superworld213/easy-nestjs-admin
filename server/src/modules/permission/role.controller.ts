import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Menu, PageList, Role } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:role')
@Controller('admin/role')
export class RoleController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:role:index')
  page(@Query() query: PaginationQueryDto): Promise<PageList<Role>> {
    return this.service.pageRoles(query);
  }

  @Post()
  @Permission('permission:role:save')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createRole(body);
    return [];
  }

  @Put(':id')
  @Permission('permission:role:update')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateRole(id, body);
    return [];
  }

  @Delete()
  @Permission('permission:role:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteRoles(body);
    return [];
  }

  @Get(':id/permissions')
  @Permission('permission:role:getMenu')
  getRolePermissions(@Param('id', ParseIntPipe) id: number): Promise<Array<Pick<Menu, 'id' | 'name'>>> {
    return this.service.getRolePermissions(id);
  }

  @Put(':id/permissions')
  @Permission('permission:role:setMenu')
  async setRolePermissions(@Param('id', ParseIntPipe) id: number, @Body('permissions') permissions: string[]): Promise<[]> {
    await this.service.setRolePermissions(id, permissions ?? []);
    return [];
  }
}
