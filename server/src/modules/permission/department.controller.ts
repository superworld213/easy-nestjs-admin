import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Department } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:department')
@Controller('admin/department')
export class DepartmentController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:department:index')
  list(@Query() query: PaginationQueryDto): Promise<{ list: Department[] }> {
    return this.service.departmentList(query);
  }

  @Post()
  @Permission('permission:department:save')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createDepartment(body);
    return [];
  }

  @Put(':id')
  @Permission('permission:department:update')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateDepartment(id, body);
    return [];
  }

  @Delete()
  @Permission('permission:department:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteDepartments(body);
    return [];
  }
}
