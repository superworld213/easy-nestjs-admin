import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseEntities, getDatabaseOptions } from '../config/database.config';
import { DatabaseSeederService } from './seeders/database-seeder.service';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(getDatabaseOptions()), TypeOrmModule.forFeature(databaseEntities)],
  providers: [DatabaseSeederService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
