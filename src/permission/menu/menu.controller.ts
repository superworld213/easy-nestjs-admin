import {
  Controller, Get, Post, Put, Delete, Body, Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Controller('permission/menus')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @Permission('permission:menu:index')
  async list() {
    return this.menuService.list();
  }

  @Post()
  @Permission('permission:menu:save')
  async create(@Body() dto: CreateMenuDto, @CurrentUser() user: { id: number }) {
    return this.menuService.create(dto, user.id);
  }

  @Put(':id')
  @Permission('permission:menu:create')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateMenuDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.menuService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Permission('permission:menu:delete')
  async delete(@Param('id') id: number) {
    return this.menuService.delete(id);
  }
}
