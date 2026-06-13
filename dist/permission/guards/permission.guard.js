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
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_decorator_1 = require("../decorators/permission.decorator");
const user_entity_1 = require("../../entities/user.entity");
const role_entity_1 = require("../../entities/role.entity");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, userRepo, roleRepo) {
        this.reflector = reflector;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }
    async canActivate(context) {
        const permission = this.reflector.getAllAndOverride(permission_decorator_1.PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!permission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.ForbiddenException('未授权访问');
        }
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { roles: true },
        });
        if (!user || user.status === 2) {
            throw new common_1.ForbiddenException('用户已停用');
        }
        const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
        if (isSuperAdmin) {
            return true;
        }
        const codes = Array.isArray(permission.code) ? permission.code : [permission.code];
        const { operation = 'and' } = permission;
        const hasPermission = await this.checkPermission(userId, codes, operation);
        if (!hasPermission) {
            throw new common_1.ForbiddenException('无权访问');
        }
        return true;
    }
    async checkPermission(userId, codes, operation) {
        const userRoles = await this.roleRepo
            .createQueryBuilder('role')
            .innerJoin('user_belongs_role', 'ubr', 'ubr.role_id = role.id')
            .innerJoin('role_belongs_menu', 'rbm', 'rbm.role_id = role.id')
            .innerJoin('menu', 'menu', 'menu.id = rbm.menu_id')
            .where('ubr.user_id = :userId', { userId })
            .andWhere('role.status = 1')
            .andWhere('menu.name IN (:...codes)', { codes })
            .select('DISTINCT menu.name', 'name')
            .getRawMany();
        const matchedCodes = new Set(userRoles.map((r) => r.name));
        if (operation === 'and') {
            return codes.every((code) => matchedCodes.has(code));
        }
        return codes.some((code) => matchedCodes.has(code));
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map