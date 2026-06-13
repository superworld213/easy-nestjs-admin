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
exports.PositionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const position_entity_1 = require("../../entities/position.entity");
const data_permission_policy_entity_1 = require("../../entities/data-permission-policy.entity");
let PositionService = class PositionService {
    constructor(posRepo, policyRepo) {
        this.posRepo = posRepo;
        this.policyRepo = policyRepo;
    }
    async page(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = {};
        if (query.name)
            where.name = query.name;
        if (query.dept_id)
            where.dept_id = query.dept_id;
        const [list, total] = await this.posRepo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { id: 'ASC' },
            relations: { department: true },
        });
        return { list, total, page, pageSize };
    }
    async create(dto) {
        const pos = this.posRepo.create(dto);
        return this.posRepo.save(pos);
    }
    async update(id, dto) {
        const pos = await this.posRepo.findOneBy({ id });
        if (!pos)
            throw new common_1.NotFoundException('岗位不存在');
        Object.assign(pos, dto);
        return this.posRepo.save(pos);
    }
    async delete(id) {
        const pos = await this.posRepo.findOneBy({ id });
        if (!pos)
            throw new common_1.NotFoundException('岗位不存在');
        await this.posRepo.softDelete(id);
        return { message: '删除成功' };
    }
    async getDataPermission(positionId) {
        return this.policyRepo.findOne({ where: { position_id: positionId } });
    }
    async setDataPermission(positionId, dto) {
        let policy = await this.policyRepo.findOne({ where: { position_id: positionId } });
        if (policy) {
            policy.policy_type = dto.policy_type;
            policy.value = dto.value;
        }
        else {
            policy = this.policyRepo.create({
                position_id: positionId,
                policy_type: dto.policy_type,
                value: dto.value,
                is_default: true,
            });
        }
        return this.policyRepo.save(policy);
    }
};
exports.PositionService = PositionService;
exports.PositionService = PositionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(position_entity_1.Position)),
    __param(1, (0, typeorm_1.InjectRepository)(data_permission_policy_entity_1.DataPermissionPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PositionService);
//# sourceMappingURL=position.service.js.map