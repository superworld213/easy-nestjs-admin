import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepo: Repository<User>, jwtService: JwtService, configService: ConfigService);
    login(username: string, password: string): Promise<{
        user: {
            id: number;
            username: string;
            nickname: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(userId: number): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getUserInfo(userId: number): Promise<{
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
    }>;
    generateTokens(userId: number): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
