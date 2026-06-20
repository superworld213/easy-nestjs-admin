import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { Menu } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:menu')
@Controller('admin/menu')
export class MenuController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:menu:index')
  list(): Promise<Menu[]> {
    return this.service.listMenus();
  }

  @Post()
  @Permission('permission:menu:create')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createMenu(body);
    return [];
  }

  @Put(':id')
  @Permission('permission:menu:save')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateMenu(id, body);
    return [];
  }

  @Delete()
  @Permission('permission:menu:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteMenus(body);
    return [];
  }
}
