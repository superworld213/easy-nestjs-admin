import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { PositionService } from './position.service';
import { CreatePositionDto, UpdatePositionDto, SetDataPermissionDto } from './dto/position.dto';

@Controller('permission/positions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PositionController {
  constructor(private readonly posService: PositionService) {}

  @Get()
  @Permission('permission:position:index')
  async page(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('name') name?: string,
    @Query('dept_id') dept_id?: number,
  ) {
    return this.posService.page({ page, pageSize, name, dept_id });
  }

  @Post()
  @Permission('permission:position:save')
  async create(@Body() dto: CreatePositionDto) {
    return this.posService.create(dto);
  }

  @Put(':id')
  @Permission('permission:position:update')
  async update(@Param('id') id: number, @Body() dto: UpdatePositionDto) {
    return this.posService.update(id, dto);
  }

  @Delete(':id')
  @Permission('permission:position:delete')
  async delete(@Param('id') id: number) {
    return this.posService.delete(id);
  }

  @Get(':id/data-permission')
  @Permission('permission:position:data_permission')
  async getDataPermission(@Param('id') id: number) {
    return this.posService.getDataPermission(id);
  }

  @Put(':id/data-permission')
  @Permission('permission:position:data_permission')
  async setDataPermission(@Param('id') id: number, @Body() dto: SetDataPermissionDto) {
    return this.posService.setDataPermission(id, dto);
  }
}
