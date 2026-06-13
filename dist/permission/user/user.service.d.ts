import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private readonly userRepo;
    private readonly roleRepo;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>);
    page(query: {
        page?: number;
        pageSize?: number;
        username?: string;
        status?: number;
    }): Promise<{
        list: {
            password: undefined;
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
            roles: Role[];
            departments: import("../../entities").Department[];
            dept_leader: import("../../entities").Department[];
            positions: import("../../entities").Position[];
            policies: import("../../entities").DataPermissionPolicy[];
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateUserDto, createdBy?: number): Promise<User>;
    update(id: number, dto: UpdateUserDto, updatedBy?: number): Promise<User>;
    delete(id: number): Promise<{
        message: string;
    }>;
    resetPassword(id: number): Promise<{
        message: string;
    }>;
    getRoles(userId: number): Promise<Role[]>;
    setRoles(userId: number, roleIds: number[]): Promise<{
        message: string;
    }>;
}
