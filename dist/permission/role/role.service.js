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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../../entities/role.entity");
const menu_entity_1 = require("../../entities/menu.entity");
let RoleService = class RoleService {
    constructor(roleRepo, menuRepo) {
        this.roleRepo = roleRepo;
        this.menuRepo = menuRepo;
    }
    async page(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = {};
        if (query.name)
            where.name = query.name;
        if (query.status)
            where.status = query.status;
        const [list, total] = await this.roleRepo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { sort: 'ASC', id: 'ASC' },
        });
        return { list, total, page, pageSize };
    }
    async create(dto, createdBy) {
        const role = this.roleRepo.create({ ...dto, created_by: createdBy });
        return this.roleRepo.save(role);
    }
    async update(id, dto, updatedBy) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role)
            throw new common_1.NotFoundException('角色不存在');
        Object.assign(role, dto, { updated_by: updatedBy });
        return this.roleRepo.save(role);
    }
    async delete(id) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role)
            throw new common_1.NotFoundException('角色不存在');
        await this.roleRepo.delete(id);
        return { message: '删除成功' };
    }
    async getMenus(roleId) {
        const role = await this.roleRepo.findOne({
            where: { id: roleId },
            relations: { menus: true },
        });
        return role?.menus ?? [];
    }
    async setMenus(roleId, menuIds) {
        const role = await this.roleRepo.findOne({
            where: { id: roleId },
            relations: { menus: true },
        });
        if (!role)
            throw new common_1.NotFoundException('角色不存在');
        const menus = menuIds.length > 0
            ? await this.menuRepo.findBy({ id: (0, typeorm_2.In)(menuIds) })
            : [];
        role.menus = menus;
        await this.roleRepo.save(role);
        return { message: '设置成功' };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map