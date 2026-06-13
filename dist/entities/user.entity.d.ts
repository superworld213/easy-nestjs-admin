import { Role } from './role.entity';
import { Department } from './department.entity';
import { Position } from './position.entity';
import { DataPermissionPolicy } from './data-permission-policy.entity';
export declare enum UserStatus {
    NORMAL = 1,
    DISABLE = 2
}
export declare class User {
    id: number;
    username: string;
    password: string;
    user_type: string;
    nickname: string;
    phone: string;
    email: string;
    avatar: string;
    signed: string;
    status: number;
    login_ip: string;
    login_time: Date;
    backend_setting: Record<string, any>;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    remark: string;
    roles: Role[];
    departments: Department[];
    dept_leader: Department[];
    positions: Position[];
    policies: DataPermissionPolicy[];
}
