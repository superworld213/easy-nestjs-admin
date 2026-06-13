import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { DataPermissionModule } from './data-permission/data-permission.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Menu } from './entities/menu.entity';
import { Department } from './entities/department.entity';
import { Position } from './entities/position.entity';
import { DataPermissionPolicy } from './entities/data-permission-policy.entity';

const entities = [User, Role, Menu, Department, Position, DataPermissionPolicy];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST') ?? '127.0.0.1',
        port: parseInt(config.get<string>('DB_PORT') ?? '3306', 10),
        username: config.get<string>('DB_USERNAME') ?? 'root',
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_DATABASE') ?? 'mineadmin',
        entities,
        synchronize: false,
      }),
    }),
    AuthModule,
    PermissionModule,
    DataPermissionModule,
  ],
})
export class AppModule {}
