import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async page(query: { page?: number; pageSize?: number; username?: string; status?: number }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: any = {};
    if (query.username) where.username = Like(`%${query.username}%`);
    if (query.status) where.status = query.status;

    const [list, total] = await this.userRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
      relations: { roles: true },
    });

    return {
      list: list.map((u) => ({ ...u, password: undefined })),
      total,
      page,
      pageSize,
    };
  }

  async create(dto: CreateUserDto, createdBy?: number) {
    const user = this.userRepo.create({
      ...dto,
      password: dto.password ? await bcrypt.hash(dto.password, 10) : await bcrypt.hash('123456', 10),
      created_by: createdBy,
    });
    return this.userRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto, updatedBy?: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('用户不存在');
    Object.assign(user, dto, { updated_by: updatedBy });
    return this.userRepo.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('用户不存在');
    await this.userRepo.delete(id);
    return { message: '删除成功' };
  }

  async resetPassword(id: number) {
    const hash = await bcrypt.hash('123456', 10);
    await this.userRepo.update(id, { password: hash });
    return { message: '重置成功' };
  }

  async getRoles(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    return user?.roles ?? [];
  }

  async setRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('用户不存在');

    const roles = roleIds.length > 0
      ? await this.roleRepo.findBy({ id: In(roleIds) })
      : [];
    user.roles = roles;
    await this.userRepo.save(user);
    return { message: '设置成功' };
  }
}
