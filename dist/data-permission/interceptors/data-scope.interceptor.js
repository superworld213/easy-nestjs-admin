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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataScopeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const data_scope_decorator_1 = require("../decorators/data-scope.decorator");
const data_permission_service_1 = require("../data-permission.service");
let DataScopeInterceptor = class DataScopeInterceptor {
    constructor(reflector, dataPermissionService) {
        this.reflector = reflector;
        this.dataPermissionService = dataPermissionService;
    }
    async intercept(context, next) {
        const options = this.reflector.getAllAndOverride(data_scope_decorator_1.DATA_SCOPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!options) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        if (!userId) {
            return next.handle();
        }
        request.dataScope = {
            ...options,
            userId,
            applyDataScope: (qb, currentTable) => {
                return this.dataPermissionService.applyDataScope(qb, userId, {
                    ...options,
                    currentTable,
                });
            },
        };
        return next.handle();
    }
};
exports.DataScopeInterceptor = DataScopeInterceptor;
exports.DataScopeInterceptor = DataScopeInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        data_permission_service_1.DataPermissionService])
], DataScopeInterceptor);
//# sourceMappingURL=data-scope.interceptor.js.map