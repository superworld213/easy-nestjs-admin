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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("../../entities/menu.entity");
let MenuService = class MenuService {
    constructor(menuRepo) {
        this.menuRepo = menuRepo;
    }
    async list() {
        const menus = await this.menuRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
        return this.buildTree(menus);
    }
    async create(dto, createdBy) {
        const menu = this.menuRepo.create({ ...dto, created_by: createdBy });
        return this.menuRepo.save(menu);
    }
    async update(id, dto, updatedBy) {
        const menu = await this.menuRepo.findOneBy({ id });
        if (!menu)
            throw new common_1.NotFoundException('菜单不存在');
        Object.assign(menu, dto, { updated_by: updatedBy });
        return this.menuRepo.save(menu);
    }
    async delete(id) {
        const menu = await this.menuRepo.findOneBy({ id });
        if (!menu)
            throw new common_1.NotFoundException('菜单不存在');
        await this.menuRepo.delete(id);
        return { message: '删除成功' };
    }
    buildTree(menus, parentId = 0) {
        return menus
            .filter((m) => m.parent_id === parentId)
            .map((m) => ({
            ...m,
            children: this.buildTree(menus, m.id),
        }));
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map