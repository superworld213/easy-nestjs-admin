import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Leader, PageList } from '../../common/types/entities';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('admin:leader')
@Controller('admin/leader')
export class LeaderController {
  constructor(private readonly service: PermissionService) {}

  @Get('list')
  @Permission('permission:leader:index')
  page(@Query() query: PaginationQueryDto): Promise<PageList<Leader>> {
    return this.service.pageLeaders(query);
  }

  @Post()
  @Permission('permission:leader:save')
  async create(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.createLeader(body);
    return [];
  }

  @Put(':id')
  @Permission('permission:leader:save')
  async save(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>): Promise<[]> {
    await this.service.updateLeader(id, body);
    return [];
  }

  @Delete()
  @Permission('permission:leader:delete')
  async delete(@Body() body: Record<string, any>): Promise<[]> {
    await this.service.deleteLeaders(body);
    return [];
  }
}
