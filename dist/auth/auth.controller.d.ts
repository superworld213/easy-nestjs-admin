import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            username: string;
            nickname: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(user: {
        id: number;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
