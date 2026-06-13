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
exports.DepartmentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../guards/permission.guard");
const permission_decorator_1 = require("../decorators/permission.decorator");
const department_service_1 = require("./department.service");
const department_dto_1 = require("./dto/department.dto");
let DepartmentController = class DepartmentController {
    constructor(deptService) {
        this.deptService = deptService;
    }
    async list() {
        return this.deptService.list();
    }
    async create(dto) {
        return this.deptService.create(dto);
    }
    async update(id, dto) {
        return this.deptService.update(id, dto);
    }
    async delete(id) {
        return this.deptService.delete(id);
    }
};
exports.DepartmentController = DepartmentController;
__decorate([
    (0, common_1.Get)(),
    (0, permission_decorator_1.Permission)('permission:department:index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, permission_decorator_1.Permission)('permission:department:save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [department_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permission_decorator_1.Permission)('permission:department:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, department_dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permission_decorator_1.Permission)('permission:department:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "delete", null);
exports.DepartmentController = DepartmentController = __decorate([
    (0, common_1.Controller)('permission/departments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [department_service_1.DepartmentService])
], DepartmentController);
//# sourceMappingURL=department.controller.js.map