"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepo, jwtService, configService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(username, password) {
        const user = await this.userRepo.findOne({
            where: { username },
            select: { id: true, username: true, password: true, status: true, nickname: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.status === user_entity_1.UserStatus.DISABLE) {
            throw new common_1.UnauthorizedException('用户已停用');
        }
        const tokens = await this.generateTokens(user.id);
        await this.userRepo.update(user.id, {
            login_ip: '',
            login_time: new Date(),
        });
        return {
            ...tokens,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
            },
        };
    }
    async refresh(userId) {
        return this.generateTokens(userId);
    }
    async getUserInfo(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { roles: { menus: true }, departments: true, positions: { department: true } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        if (user.status === user_entity_1.UserStatus.DISABLE) {
            throw new common_1.UnauthorizedException('用户已停用');
        }
        const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
        const permissions = isSuperAdmin
            ? ['*']
            : [...new Set(user.roles?.flatMap((r) => r.menus?.map((m) => m.name) ?? []) ?? [])];
        return {
            ...user,
            password: undefined,
            isSuperAdmin,
            permissions,
        };
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES', '1h'),
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES', '2h'),
            }),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map