"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../entities/user.entity");
const menu_entity_1 = require("../entities/menu.entity");
const class_validator_1 = require("class-validator");
class UpdateProfileDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "signed", void 0);
let PermissionController = class PermissionController {
    constructor(userRepo, menuRepo) {
        this.userRepo = userRepo;
        this.menuRepo = menuRepo;
    }
    async getProfile(currentUser) {
        const user = await this.userRepo.findOne({
            where: { id: currentUser.id },
            relations: { roles: { menus: true }, departments: true, positions: { department: true } },
        });
        if (!user) {
            return { code: 401, message: '用户不存在' };
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
    async getMenus(currentUser) {
        const user = await this.userRepo.findOne({
            where: { id: currentUser.id },
            relations: { roles: { menus: true } },
        });
        if (!user)
            return [];
        const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
        let menus;
        if (isSuperAdmin) {
            menus = await this.menuRepo.find({
                where: { status: user_entity_1.UserStatus.NORMAL },
                order: { sort: 'ASC' },
            });
        }
        else {
            const permissionNames = [
                ...new Set(user.roles?.flatMap((r) => r.menus?.map((m) => m.name) ?? []) ?? []),
            ];
            if (permissionNames.length === 0)
                return [];
            menus = await this.menuRepo
                .createQueryBuilder('menu')
                .where('menu.status = :status', { status: user_entity_1.UserStatus.NORMAL })
                .andWhere('menu.name IN (:...names)', { names: permissionNames })
                .orderBy('menu.sort', 'ASC')
                .getMany();
        }
        return this.buildTree(menus);
    }
    async updateProfile(currentUser, dto) {
        await this.userRepo.update(currentUser.id, dto);
        return { message: '更新成功' };
    }
    buildTree(menus, parentId = 0) {
        return menus
            .filter((m) => m.parent_id === parentId)
            .map((m) => ({
            ...m,
            children: this.buildTree(menus, m.id),
        }));
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('menus'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "updateProfile", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.Controller)('permission'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map