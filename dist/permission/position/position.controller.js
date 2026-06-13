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
exports.PositionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../guards/permission.guard");
const permission_decorator_1 = require("../decorators/permission.decorator");
const position_service_1 = require("./position.service");
const position_dto_1 = require("./dto/position.dto");
let PositionController = class PositionController {
    constructor(posService) {
        this.posService = posService;
    }
    async page(page, pageSize, name, dept_id) {
        return this.posService.page({ page, pageSize, name, dept_id });
    }
    async create(dto) {
        return this.posService.create(dto);
    }
    async update(id, dto) {
        return this.posService.update(id, dto);
    }
    async delete(id) {
        return this.posService.delete(id);
    }
    async getDataPermission(id) {
        return this.posService.getDataPermission(id);
    }
    async setDataPermission(id, dto) {
        return this.posService.setDataPermission(id, dto);
    }
};
exports.PositionController = PositionController;
__decorate([
    (0, common_1.Get)(),
    (0, permission_decorator_1.Permission)('permission:position:index'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('dept_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "page", null);
__decorate([
    (0, common_1.Post)(),
    (0, permission_decorator_1.Permission)('permission:position:save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [position_dto_1.CreatePositionDto]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permission_decorator_1.Permission)('permission:position:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, position_dto_1.UpdatePositionDto]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permission_decorator_1.Permission)('permission:position:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/data-permission'),
    (0, permission_decorator_1.Permission)('permission:position:data_permission'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "getDataPermission", null);
__decorate([
    (0, common_1.Put)(':id/data-permission'),
    (0, permission_decorator_1.Permission)('permission:position:data_permission'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, position_dto_1.SetDataPermissionDto]),
    __metadata("design:returntype", Promise)
], PositionController.prototype, "setDataPermission", null);
exports.PositionController = PositionController = __decorate([
    (0, common_1.Controller)('permission/positions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [position_service_1.PositionService])
], PositionController);
//# sourceMappingURL=position.controller.js.map