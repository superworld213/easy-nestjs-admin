import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PageList, UserLoginLog } from '../../common/types/entities';
import { LogstashService } from './logstash.service';

@ApiBearerAuth()
@ApiTags('admin:user-login-log')
@Controller('admin/user-login-log')
export class UserLoginLogController {
  constructor(private readonly service: LogstashService) {}

  @Get('list')
  @Permission('log:userLogin:list')
  page(@Query() query: PaginationQueryDto): Promise<PageList<UserLoginLog>> {
    return this.service.pageLoginLogs(query);
  }

  @Delete()
  @Permission('log:userLogin:delete')
  async delete(@Body() body: unknown): Promise<[]> {
    await this.service.deleteLoginLogs(body);
    return [];
  }
}
