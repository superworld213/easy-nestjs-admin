import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Menu } from '../../entities/menu.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async page(query: { page?: number; pageSize?: number; name?: string; status?: number }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: any = {};
    if (query.name) where.name = query.name;
    if (query.status) where.status = query.status;

    const [list, total] = await this.roleRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', id: 'ASC' },
    });

    return { list, total, page, pageSize };
  }

  async create(dto: CreateRoleDto, createdBy?: number) {
    const role = this.roleRepo.create({ ...dto, created_by: createdBy });
    return this.roleRepo.save(role);
  }

  async update(id: number, dto: UpdateRoleDto, updatedBy?: number) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('角色不存在');
    Object.assign(role, dto, { updated_by: updatedBy });
    return this.roleRepo.save(role);
  }

  async delete(id: number) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('角色不存在');
    await this.roleRepo.delete(id);
    return { message: '删除成功' };
  }

  async getMenus(roleId: number) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: { menus: true },
    });
    return role?.menus ?? [];
  }

  async setMenus(roleId: number, menuIds: number[]) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: { menus: true },
    });
    if (!role) throw new NotFoundException('角色不存在');

    const menus = menuIds.length > 0
      ? await this.menuRepo.findBy({ id: In(menuIds) })
      : [];
    role.menus = menus;
    await this.roleRepo.save(role);
    return { message: '设置成功' };
  }
}
