import {
  Controller, Get, Post, Put, Delete, Body, Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Controller('permission/departments')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DepartmentController {
  constructor(private readonly deptService: DepartmentService) {}

  @Get()
  @Permission('permission:department:index')
  async list() {
    return this.deptService.list();
  }

  @Post()
  @Permission('permission:department:save')
  async create(@Body() dto: CreateDepartmentDto) {
    return this.deptService.create(dto);
  }

  @Put(':id')
  @Permission('permission:department:update')
  async update(@Param('id') id: number, @Body() dto: UpdateDepartmentDto) {
    return this.deptService.update(id, dto);
  }

  @Delete(':id')
  @Permission('permission:department:delete')
  async delete(@Param('id') id: number) {
    return this.deptService.delete(id);
  }
}
