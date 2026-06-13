import { ScopeType } from '../enums/scope-type.enum';
export declare const DATA_SCOPE_KEY = "data_scope";
export interface DataScopeOptions {
    scopeType: ScopeType;
    onlyTables?: string[];
    deptColumn?: string;
    createdByColumn?: string;
}
export declare const DataScope: (options: DataScopeOptions) => import("@nestjs/common").CustomDecorator<string>;
