import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
  ) {}

  async list() {
    const depts = await this.deptRepo.find({
      order: { id: 'ASC' },
      withDeleted: true,
    });
    return this.buildTree(depts);
  }

  async create(dto: CreateDepartmentDto) {
    const dept = this.deptRepo.create(dto);
    return this.deptRepo.save(dept);
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const dept = await this.deptRepo.findOne({ where: { id }, withDeleted: true });
    if (!dept) throw new NotFoundException('部门不存在');
    Object.assign(dept, dto);
    return this.deptRepo.save(dept);
  }

  async delete(id: number) {
    const dept = await this.deptRepo.findOneBy({ id });
    if (!dept) throw new NotFoundException('部门不存在');
    await this.deptRepo.softDelete(id);
    return { message: '删除成功' };
  }

  private buildTree(depts: Department[], parentId = 0): any[] {
    return depts
      .filter((d) => d.parent_id === parentId)
      .map((d) => ({
        ...d,
        children: this.buildTree(depts, d.id),
      }));
  }
}
