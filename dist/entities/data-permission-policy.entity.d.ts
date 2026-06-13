import { User } from './user.entity';
import { Position } from './position.entity';
export declare enum PolicyType {
    ALL = "ALL",
    SELF = "SELF",
    DEPT_SELF = "DEPT_SELF",
    DEPT_TREE = "DEPT_TREE",
    CUSTOM_DEPT = "CUSTOM_DEPT",
    CUSTOM_FUNC = "CUSTOM_FUNC"
}
export declare class DataPermissionPolicy {
    id: number;
    user_id: number;
    position_id: number;
    policy_type: string;
    is_default: boolean;
    value: any;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: User;
    position: Position;
}
