import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

import { getDatabaseOptions } from '../config/database.config';

const options = getDatabaseOptions() as DataSourceOptions;

export default new DataSource({
  ...options,
  migrationsRun: false,
  synchronize: false,
});
