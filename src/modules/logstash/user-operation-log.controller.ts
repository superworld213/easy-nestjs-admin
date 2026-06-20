import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PageList, UserOperationLog } from '../../common/types/entities';
import { LogstashService } from './logstash.service';

@ApiBearerAuth()
@ApiTags('admin:user-operation-log')
@Controller('admin/user-operation-log')
export class UserOperationLogController {
  constructor(private readonly service: LogstashService) {}

  @Get('list')
  @Permission('log:userOperation:list')
  page(@Query() query: PaginationQueryDto): Promise<PageList<UserOperationLog>> {
    return this.service.pageOperationLogs(query);
  }

  @Delete()
  @Permission('log:userOperation:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteOperationLogs(body);
    return [];
  }
}
