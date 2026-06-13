import { User } from './user.entity';
import { Position } from './position.entity';
export declare class Department {
    id: number;
    name: string;
    parent_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    department_users: User[];
    leaders: User[];
    positions: Position[];
}
