import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { OperationLogInterceptor } from './common/interceptors/operation-log.interceptor';
import { DatabaseModule } from './database/database.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { LogstashModule } from './modules/logstash/logstash.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [DatabaseModule, AuthModule, PermissionModule, AttachmentModule, LogstashModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
