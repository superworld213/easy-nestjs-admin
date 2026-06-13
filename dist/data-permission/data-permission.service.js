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
exports.DataPermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const department_entity_1 = require("../entities/department.entity");
const data_permission_policy_entity_1 = require("../entities/data-permission-policy.entity");
const scope_type_enum_1 = require("./enums/scope-type.enum");
let DataPermissionService = class DataPermissionService {
    constructor(userRepo, deptRepo, policyRepo) {
        this.userRepo = userRepo;
        this.deptRepo = deptRepo;
        this.policyRepo = policyRepo;
    }
    async getUserPolicy(userId) {
        const policy = await this.policyRepo.findOne({ where: { user_id: userId } });
        if (policy)
            return policy;
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { positions: true },
        });
        if (!user?.positions?.length)
            return null;
        for (const pos of user.positions) {
            const posPolicy = await this.policyRepo.findOne({
                where: { position_id: pos.id },
            });
            if (posPolicy)
                return posPolicy;
        }
        return null;
    }
    async getDeptIds(userId, policy) {
        const policyType = policy.policy_type;
        if (policyType === data_permission_policy_entity_1.PolicyType.ALL)
            return null;
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { departments: true },
        });
        if (!user)
            return [];
        const userDeptIds = user.departments?.map((d) => d.id) ?? [];
        switch (policyType) {
            case data_permission_policy_entity_1.PolicyType.SELF:
                return [];
            case data_permission_policy_entity_1.PolicyType.DEPT_SELF:
                return userDeptIds;
            case data_permission_policy_entity_1.PolicyType.DEPT_TREE: {
                const allDeptIds = new Set(userDeptIds);
                for (const deptId of userDeptIds) {
                    const children = await this.getDescendantDeptIds(deptId);
                    children.forEach((id) => allDeptIds.add(id));
                }
                return [...allDeptIds];
            }
            case data_permission_policy_entity_1.PolicyType.CUSTOM_DEPT: {
                const customIds = policy.value ?? [];
                const allIds = new Set(customIds);
                for (const deptId of customIds) {
                    const children = await this.getDescendantDeptIds(deptId);
                    children.forEach((id) => allIds.add(id));
                }
                return [...allIds];
            }
            default:
                return null;
        }
    }
    async getCreatedByIds(userId, policy) {
        const policyType = policy.policy_type;
        if (policyType === data_permission_policy_entity_1.PolicyType.ALL)
            return null;
        if (policyType === data_permission_policy_entity_1.PolicyType.SELF)
            return [userId];
        const deptIds = await this.getDeptIds(userId, policy);
        if (!deptIds || deptIds.length === 0)
            return [];
        const users = await this.userRepo
            .createQueryBuilder('user')
            .innerJoin('user_dept', 'ud', 'ud.user_id = user.id')
            .where('ud.dept_id IN (:...deptIds)', { deptIds })
            .select('user.id', 'id')
            .getRawMany();
        return users.map((u) => u.id);
    }
    async applyDataScope(qb, userId, options) {
        if (options.onlyTables?.length && options.currentTable) {
            if (!options.onlyTables.includes(options.currentTable))
                return;
        }
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { roles: true },
        });
        if (!user)
            return;
        const isSuperAdmin = user.roles?.some((r) => r.code === 'SuperAdmin') ?? false;
        if (isSuperAdmin)
            return;
        const policy = await this.getUserPolicy(userId);
        if (!policy)
            return;
        const scopeType = options.scopeType;
        if (scopeType === scope_type_enum_1.ScopeType.DEPT || scopeType === scope_type_enum_1.ScopeType.DEPT_CREATED_BY || scopeType === scope_type_enum_1.ScopeType.DEPT_OR_CREATED_BY) {
            const deptColumn = options.deptColumn ?? 'dept_id';
            const deptIds = await this.getDeptIds(userId, policy);
            if (deptIds !== null) {
                if (scopeType === scope_type_enum_1.ScopeType.DEPT_OR_CREATED_BY) {
                    const createdByColumn = options.createdByColumn ?? 'created_by';
                    const createdByIds = await this.getCreatedByIds(userId, policy);
                    if (createdByIds !== null) {
                        qb.andWhere(`(${qb.alias}.${deptColumn} IN (:...deptIds) OR ${qb.alias}.${createdByColumn} IN (:...createdByIds))`, { deptIds, createdByIds });
                        return;
                    }
                }
                qb.andWhere(`${qb.alias}.${deptColumn} IN (:...deptIds)`, { deptIds });
            }
        }
        if (scopeType === scope_type_enum_1.ScopeType.CREATED_BY || scopeType === scope_type_enum_1.ScopeType.DEPT_CREATED_BY) {
            const createdByColumn = options.createdByColumn ?? 'created_by';
            const createdByIds = await this.getCreatedByIds(userId, policy);
            if (createdByIds !== null) {
                qb.andWhere(`${qb.alias}.${createdByColumn} IN (:...createdByIds)`, { createdByIds });
            }
        }
    }
    async getDescendantDeptIds(deptId) {
        const children = await this.deptRepo.find({ where: { parent_id: deptId } });
        const ids = children.map((c) => c.id);
        for (const child of children) {
            const descendantIds = await this.getDescendantDeptIds(child.id);
            ids.push(...descendantIds);
        }
        return ids;
    }
};
exports.DataPermissionService = DataPermissionService;
exports.DataPermissionService = DataPermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(2, (0, typeorm_1.InjectRepository)(data_permission_policy_entity_1.DataPermissionPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DataPermissionService);
//# sourceMappingURL=data-permission.service.js.map