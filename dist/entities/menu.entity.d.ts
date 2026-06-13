import { Role } from './role.entity';
export declare class Menu {
    id: number;
    parent_id: number;
    name: string;
    component: string;
    redirect: string;
    path: string;
    status: number;
    meta: Record<string, any>;
    sort: number;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    remark: string;
    roles: Role[];
}
