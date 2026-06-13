import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { DataPermissionPolicy } from '../entities/data-permission-policy.entity';
export declare class DataPermissionService {
    private readonly userRepo;
    private readonly deptRepo;
    private readonly policyRepo;
    constructor(userRepo: Repository<User>, deptRepo: Repository<Department>, policyRepo: Repository<DataPermissionPolicy>);
    getUserPolicy(userId: number): Promise<DataPermissionPolicy | null>;
    getDeptIds(userId: number, policy: DataPermissionPolicy): Promise<number[] | null>;
    getCreatedByIds(userId: number, policy: DataPermissionPolicy): Promise<number[] | null>;
    applyDataScope(qb: any, userId: number, options: {
        scopeType: number;
        deptColumn?: string;
        createdByColumn?: string;
        onlyTables?: string[];
        currentTable?: string;
    }): Promise<void>;
    private getDescendantDeptIds;
}
