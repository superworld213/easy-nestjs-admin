import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { DepartmentController } from './department.controller';
import { LeaderController } from './leader.controller';
import { MenuController } from './menu.controller';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PositionController } from './position.controller';
import { RoleController } from './role.controller';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    PermissionController,
    UserController,
    RoleController,
    MenuController,
    DepartmentController,
    PositionController,
    LeaderController,
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
