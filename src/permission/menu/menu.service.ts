import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async list() {
    const menus = await this.menuRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
    return this.buildTree(menus);
  }

  async create(dto: CreateMenuDto, createdBy?: number) {
    const menu = this.menuRepo.create({ ...dto, created_by: createdBy });
    return this.menuRepo.save(menu);
  }

  async update(id: number, dto: UpdateMenuDto, updatedBy?: number) {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException('菜单不存在');
    Object.assign(menu, dto, { updated_by: updatedBy });
    return this.menuRepo.save(menu);
  }

  async delete(id: number) {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException('菜单不存在');
    await this.menuRepo.delete(id);
    return { message: '删除成功' };
  }

  private buildTree(menus: Menu[], parentId = 0): any[] {
    return menus
      .filter((m) => m.parent_id === parentId)
      .map((m) => ({
        ...m,
        children: this.buildTree(menus, m.id),
      }));
  }
}
