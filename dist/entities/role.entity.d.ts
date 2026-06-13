import { User } from './user.entity';
import { Menu } from './menu.entity';
export declare class Role {
    id: number;
    name: string;
    code: string;
    status: number;
    sort: number;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    remark: string;
    users: User[];
    menus: Menu[];
}
