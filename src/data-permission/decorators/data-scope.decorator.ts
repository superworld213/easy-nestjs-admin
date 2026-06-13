import { SetMetadata } from '@nestjs/common';
import { ScopeType } from '../enums/scope-type.enum';

export const DATA_SCOPE_KEY = 'data_scope';

export interface DataScopeOptions {
  scopeType: ScopeType;
  onlyTables?: string[];
  deptColumn?: string;
  createdByColumn?: string;
}

export const DataScope = (options: DataScopeOptions) =>
  SetMetadata(DATA_SCOPE_KEY, options);
