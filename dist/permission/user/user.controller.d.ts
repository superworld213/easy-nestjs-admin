import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SetRolesDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    page(page?: number, pageSize?: number, username?: string, status?: number): Promise<{
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
            roles: import("../../entities").Role[];
            departments: import("../../entities").Department[];
            dept_leader: import("../../entities").Department[];
            positions: import("../../entities").Position[];
            policies: import("../../entities").DataPermissionPolicy[];
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateUserDto, user: {
        id: number;
    }): Promise<import("../../entities").User>;
    update(id: number, dto: UpdateUserDto, user: {
        id: number;
    }): Promise<import("../../entities").User>;
    delete(id: number): Promise<{
        message: string;
    }>;
    resetPassword(id: number): Promise<{
        message: string;
    }>;
    getRoles(id: number): Promise<import("../../entities").Role[]>;
    setRoles(id: number, dto: SetRolesDto): Promise<{
        message: string;
    }>;
}
