import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Menu } from '../entities/menu.entity';
import { PermissionController } from './permission.controller';
import { PermissionGuard } from './guards/permission.guard';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu]),
    UserModule,
    RoleModule,
    MenuModule,
    DepartmentModule,
    PositionModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionGuard],
  exports: [PermissionGuard],
})
export class PermissionModule {}
