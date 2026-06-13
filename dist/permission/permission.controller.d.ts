import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Menu } from '../entities/menu.entity';
declare class UpdateProfileDto {
    nickname?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    signed?: string;
}
export declare class PermissionController {
    private readonly userRepo;
    private readonly menuRepo;
    constructor(userRepo: Repository<User>, menuRepo: Repository<Menu>);
    getProfile(currentUser: {
        id: number;
    }): Promise<{
        code: number;
        message: string;
    } | {
        password: undefined;
        isSuperAdmin: boolean;
        permissions: string[];
        id: number;
        username: string;
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
        roles: import("../entities").Role[];
        departments: import("../entities").Department[];
        dept_leader: import("../entities").Department[];
        positions: import("../entities").Position[];
        policies: import("../entities").DataPermissionPolicy[];
        code?: undefined;
        message?: undefined;
    }>;
    getMenus(currentUser: {
        id: number;
    }): Promise<any[]>;
    updateProfile(currentUser: {
        id: number;
    }, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    private buildTree;
}
export {};
