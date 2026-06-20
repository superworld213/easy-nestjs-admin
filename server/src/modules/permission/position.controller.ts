import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PageList, Position } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:position')
@Controller('admin/position')
export class PositionController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:position:index')
  page(@Query() query: PaginationQueryDto): Promise<PageList<Position>> {
    return this.service.pagePositions(query);
  }

  @Post()
  @Permission('permission:position:save')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createPosition(body);
    return [];
  }

  @Put(':id/data_permission')
  @Permission('permission:position:data_permission')
  async setDataPermission(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.setPositionDataPermission(id, body);
    return [];
  }

  @Put(':id')
  @Permission('permission:position:update')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updatePosition(id, body);
    return [];
  }

  @Delete()
  @Permission('permission:position:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deletePositions(body);
    return [];
  }
}
