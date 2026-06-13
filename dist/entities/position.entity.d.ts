import { User } from './user.entity';
import { Department } from './department.entity';
import { DataPermissionPolicy } from './data-permission-policy.entity';
export declare class Position {
    id: number;
    name: string;
    dept_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    department: Department;
    users: User[];
    policy: DataPermissionPolicy;
}
