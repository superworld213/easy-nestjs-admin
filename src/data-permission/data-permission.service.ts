import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { DataPermissionPolicy, PolicyType } from '../entities/data-permission-policy.entity';
import { ScopeType } from './enums/scope-type.enum';

@Injectable()
export class DataPermissionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(DataPermissionPolicy)
    private readonly policyRepo: Repository<DataPermissionPolicy>,
  ) {}

  async getUserPolicy(userId: number): Promise<DataPermissionPolicy | null> {
    const policy = await this.policyRepo.findOne({ where: { user_id: userId } });
    if (policy) return policy;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { positions: true },
    });
    if (!user?.positions?.length) return null;

    for (const pos of user.positions) {
      const posPolicy = await this.policyRepo.findOne({
        where: { position_id: pos.id },
      });
      if (posPolicy) return posPolicy;
    }

    return null;
  }

  async getDeptIds(userId: number, policy: DataPermissionPolicy): Promise<number[] | null> {
    const policyType = policy.policy_type as PolicyType;

    if (policyType === PolicyType.ALL) return null;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { departments: true },
    });

    if (!user) return [];

    const userDeptIds = user.departments?.map((d: Department) => d.id) ?? [];

    switch (policyType) {
      case PolicyType.SELF:
        return [];
      case PolicyType.DEPT_SELF:
        return userDeptIds;
      case PolicyType.DEPT_TREE: {
        const allDeptIds = new Set<number>(userDeptIds);
        for (const deptId of userDeptIds) {
          const children = await this.getDescendantDeptIds(deptId);
          children.forEach((id) => allDeptIds.add(id));
        }
        return [...allDeptIds];
      }
      case PolicyType.CUSTOM_DEPT: {
        const customIds = (policy.value as number[]) ?? [];
        const allIds = new Set<number>(customIds);
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

  async getCreatedByIds(userId: number, policy: DataPermissionPolicy): Promise<number[] | null> {
    const policyType = policy.policy_type as PolicyType;

    if (policyType === PolicyType.ALL) return null;
    if (policyType === PolicyType.SELF) return [userId];

    const deptIds = await this.getDeptIds(userId, policy);
    if (!deptIds || deptIds.length === 0) return [];

    const users = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user_dept', 'ud', 'ud.user_id = user.id')
      .where('ud.dept_id IN (:...deptIds)', { deptIds })
      .select('user.id', 'id')
      .getRawMany();

    return users.map((u: any) => u.id);
  }

  async applyDataScope(
    qb: any,
    userId: number,
    options: {
      scopeType: number;
      deptColumn?: string;
      createdByColumn?: string;
      onlyTables?: string[];
      currentTable?: string;
    },
  ) {
    if (options.onlyTables?.length && options.currentTable) {
      if (!options.onlyTables.includes(options.currentTable)) return;
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) return;

    const isSuperAdmin = user.roles?.some((r: any) => r.code === 'SuperAdmin') ?? false;
    if (isSuperAdmin) return;

    const policy = await this.getUserPolicy(userId);
    if (!policy) return;

    const scopeType = options.scopeType;

    if (scopeType === ScopeType.DEPT || scopeType === ScopeType.DEPT_CREATED_BY || scopeType === ScopeType.DEPT_OR_CREATED_BY) {
      const deptColumn = options.deptColumn ?? 'dept_id';
      const deptIds = await this.getDeptIds(userId, policy);
      if (deptIds !== null) {
        if (scopeType === ScopeType.DEPT_OR_CREATED_BY) {
          const createdByColumn = options.createdByColumn ?? 'created_by';
          const createdByIds = await this.getCreatedByIds(userId, policy);
          if (createdByIds !== null) {
            qb.andWhere(
              `(${qb.alias}.${deptColumn} IN (:...deptIds) OR ${qb.alias}.${createdByColumn} IN (:...createdByIds))`,
              { deptIds, createdByIds },
            );
            return;
          }
        }
        qb.andWhere(`${qb.alias}.${deptColumn} IN (:...deptIds)`, { deptIds });
      }
    }

    if (scopeType === ScopeType.CREATED_BY || scopeType === ScopeType.DEPT_CREATED_BY) {
      const createdByColumn = options.createdByColumn ?? 'created_by';
      const createdByIds = await this.getCreatedByIds(userId, policy);
      if (createdByIds !== null) {
        qb.andWhere(`${qb.alias}.${createdByColumn} IN (:...createdByIds)`, { createdByIds });
      }
    }
  }

  private async getDescendantDeptIds(deptId: number): Promise<number[]> {
    const children = await this.deptRepo.find({ where: { parent_id: deptId } });
    const ids: number[] = children.map((c) => c.id);
    for (const child of children) {
      const descendantIds = await this.getDescendantDeptIds(child.id);
      ids.push(...descendantIds);
    }
    return ids;
  }
}
