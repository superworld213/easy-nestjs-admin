import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { AdminUserEntity } from '../database/entities/admin-user.entity';
import { AttachmentEntity } from '../database/entities/attachment.entity';
import { DataPermissionPolicyEntity } from '../database/entities/data-permission-policy.entity';
import { DepartmentEntity } from '../database/entities/department.entity';
import { DeptLeaderEntity } from '../database/entities/dept-leader.entity';
import { MenuEntity } from '../database/entities/menu.entity';
import { PositionEntity } from '../database/entities/position.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { RoleMenuEntity } from '../database/entities/role-menu.entity';
import { UserDeptEntity } from '../database/entities/user-dept.entity';
import { UserLoginLogEntity } from '../database/entities/user-login-log.entity';
import { UserOperationLogEntity } from '../database/entities/user-operation-log.entity';
import { UserPositionEntity } from '../database/entities/user-position.entity';
import { UserRoleEntity } from '../database/entities/user-role.entity';

const rootEnv = join(__dirname, '..', '..', '..', '.env');
const serverEnv = join(__dirname, '..', '..', '.env');

if (existsSync(rootEnv)) {
  loadEnv({ path: rootEnv });
}

if (existsSync(serverEnv)) {
  loadEnv({ path: serverEnv, override: true });
}

export const databaseEntities = [
  AdminUserEntity,
  AttachmentEntity,
  DataPermissionPolicyEntity,
  DepartmentEntity,
  DeptLeaderEntity,
  MenuEntity,
  PositionEntity,
  RoleEntity,
  RoleMenuEntity,
  UserDeptEntity,
  UserLoginLogEntity,
  UserOperationLogEntity,
  UserPositionEntity,
  UserRoleEntity,
];

export function getDatabaseOptions(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    database: process.env.DB_DATABASE ?? 'mineadmin',
    charset: process.env.DB_CHARSET ?? 'utf8mb4',
    timezone: '+08:00',
    entities: databaseEntities,
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'true') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  };
}
