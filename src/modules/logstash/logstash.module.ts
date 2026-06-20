import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { LogstashService } from './logstash.service';
import { UserLoginLogController } from './user-login-log.controller';
import { UserOperationLogController } from './user-operation-log.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserLoginLogController, UserOperationLogController],
  providers: [LogstashService],
  exports: [LogstashService],
})
export class LogstashModule {}
