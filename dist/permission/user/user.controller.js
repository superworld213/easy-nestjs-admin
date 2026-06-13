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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../guards/permission.guard");
const permission_decorator_1 = require("../decorators/permission.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./dto/user.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async page(page, pageSize, username, status) {
        return this.userService.page({ page, pageSize, username, status });
    }
    async create(dto, user) {
        return this.userService.create(dto, user.id);
    }
    async update(id, dto, user) {
        return this.userService.update(id, dto, user.id);
    }
    async delete(id) {
        return this.userService.delete(id);
    }
    async resetPassword(id) {
        return this.userService.resetPassword(id);
    }
    async getRoles(id) {
        return this.userService.getRoles(id);
    }
    async setRoles(id, dto) {
        return this.userService.setRoles(id, dto.roleIds);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, permission_decorator_1.Permission)('permission:user:index'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "page", null);
__decorate([
    (0, common_1.Post)(),
    (0, permission_decorator_1.Permission)('permission:user:save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permission_decorator_1.Permission)('permission:user:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permission_decorator_1.Permission)('permission:user:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/password'),
    (0, permission_decorator_1.Permission)('permission:user:password'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)(':id/roles'),
    (0, permission_decorator_1.Permission)('permission:user:getRole'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Put)(':id/roles'),
    (0, permission_decorator_1.Permission)('permission:user:setRole'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_dto_1.SetRolesDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setRoles", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('permission/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map