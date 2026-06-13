import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { DataPermissionPolicy } from '../entities/data-permission-policy.entity';
import { DataPermissionService } from './data-permission.service';
import { DataScopeInterceptor } from './interceptors/data-scope.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Department, DataPermissionPolicy])],
  providers: [DataPermissionService, DataScopeInterceptor],
  exports: [DataPermissionService, DataScopeInterceptor],
})
export class DataPermissionModule {}
