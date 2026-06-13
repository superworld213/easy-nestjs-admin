"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const permission_module_1 = require("./permission/permission.module");
const data_permission_module_1 = require("./data-permission/data-permission.module");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
const menu_entity_1 = require("./entities/menu.entity");
const department_entity_1 = require("./entities/department.entity");
const position_entity_1 = require("./entities/position.entity");
const data_permission_policy_entity_1 = require("./entities/data-permission-policy.entity");
const entities = [user_entity_1.User, role_entity_1.Role, menu_entity_1.Menu, department_entity_1.Department, position_entity_1.Position, data_permission_policy_entity_1.DataPermissionPolicy];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST') ?? '127.0.0.1',
                    port: parseInt(config.get('DB_PORT') ?? '3306', 10),
                    username: config.get('DB_USERNAME') ?? 'root',
                    password: config.get('DB_PASSWORD') ?? '',
                    database: config.get('DB_DATABASE') ?? 'mineadmin',
                    entities,
                    synchronize: false,
                }),
            }),
            auth_module_1.AuthModule,
            permission_module_1.PermissionModule,
            data_permission_module_1.DataPermissionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map