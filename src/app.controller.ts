import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiExcludeEndpoint()
  welcome(): string {
    return 'welcome use mineAdmin';
  }

  @Public()
  @Get('favicon.ico')
  @ApiExcludeEndpoint()
  favicon(): string {
    return '';
  }
}
