"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const menu_entity_1 = require("../entities/menu.entity");
const permission_controller_1 = require("./permission.controller");
const permission_guard_1 = require("./guards/permission.guard");
const user_module_1 = require("./user/user.module");
const role_module_1 = require("./role/role.module");
const menu_module_1 = require("./menu/menu.module");
const department_module_1 = require("./department/department.module");
const position_module_1 = require("./position/position.module");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.Role, menu_entity_1.Menu]),
            user_module_1.UserModule,
            role_module_1.RoleModule,
            menu_module_1.MenuModule,
            department_module_1.DepartmentModule,
            position_module_1.PositionModule,
        ],
        controllers: [permission_controller_1.PermissionController],
        providers: [permission_guard_1.PermissionGuard],
        exports: [permission_guard_1.PermissionGuard],
    })
], PermissionModule);
//# sourceMappingURL=permission.module.js.map