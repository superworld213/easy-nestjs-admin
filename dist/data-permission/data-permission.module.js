"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const department_entity_1 = require("../entities/department.entity");
const data_permission_policy_entity_1 = require("../entities/data-permission-policy.entity");
const data_permission_service_1 = require("./data-permission.service");
const data_scope_interceptor_1 = require("./interceptors/data-scope.interceptor");
let DataPermissionModule = class DataPermissionModule {
};
exports.DataPermissionModule = DataPermissionModule;
exports.DataPermissionModule = DataPermissionModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, department_entity_1.Department, data_permission_policy_entity_1.DataPermissionPolicy])],
        providers: [data_permission_service_1.DataPermissionService, data_scope_interceptor_1.DataScopeInterceptor],
        exports: [data_permission_service_1.DataPermissionService, data_scope_interceptor_1.DataScopeInterceptor],
    })
], DataPermissionModule);
//# sourceMappingURL=data-permission.module.js.map