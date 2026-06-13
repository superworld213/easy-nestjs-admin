import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../../entities/position.entity';
import { DataPermissionPolicy } from '../../entities/data-permission-policy.entity';
import { CreatePositionDto, UpdatePositionDto, SetDataPermissionDto } from './dto/position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly posRepo: Repository<Position>,
    @InjectRepository(DataPermissionPolicy)
    private readonly policyRepo: Repository<DataPermissionPolicy>,
  ) {}

  async page(query: { page?: number; pageSize?: number; name?: string; dept_id?: number }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: any = {};
    if (query.name) where.name = query.name;
    if (query.dept_id) where.dept_id = query.dept_id;

    const [list, total] = await this.posRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'ASC' },
      relations: { department: true },
    });

    return { list, total, page, pageSize };
  }

  async create(dto: CreatePositionDto) {
    const pos = this.posRepo.create(dto);
    return this.posRepo.save(pos);
  }

  async update(id: number, dto: UpdatePositionDto) {
    const pos = await this.posRepo.findOneBy({ id });
    if (!pos) throw new NotFoundException('岗位不存在');
    Object.assign(pos, dto);
    return this.posRepo.save(pos);
  }

  async delete(id: number) {
    const pos = await this.posRepo.findOneBy({ id });
    if (!pos) throw new NotFoundException('岗位不存在');
    await this.posRepo.softDelete(id);
    return { message: '删除成功' };
  }

  async getDataPermission(positionId: number) {
    return this.policyRepo.findOne({ where: { position_id: positionId } });
  }

  async setDataPermission(positionId: number, dto: SetDataPermissionDto) {
    let policy = await this.policyRepo.findOne({ where: { position_id: positionId } });
    if (policy) {
      policy.policy_type = dto.policy_type;
      policy.value = dto.value;
    } else {
      policy = this.policyRepo.create({
        position_id: positionId,
        policy_type: dto.policy_type,
        value: dto.value,
        is_default: true,
      });
    }
    return this.policyRepo.save(policy);
  }
}
