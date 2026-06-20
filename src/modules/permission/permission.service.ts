import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { In, IsNull, Repository } from 'typeorm';

import {
  AdminUser,
  Department,
  Leader,
  Menu,
  PageList,
  Position,
  Role,
} from '../../common/types/entities';
import { AdminUserEntity } from '../../database/entities/admin-user.entity';
import { DataPermissionPolicyEntity } from '../../database/entities/data-permission-policy.entity';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { DeptLeaderEntity } from '../../database/entities/dept-leader.entity';
import { MenuEntity } from '../../database/entities/menu.entity';
import { PositionEntity } from '../../database/entities/position.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { RoleMenuEntity } from '../../database/entities/role-menu.entity';
import { UserDeptEntity } from '../../database/entities/user-dept.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { UserRoleEntity } from '../../database/entities/user-role.entity';

type ResourceBody = Record<string, any>;
type ResourceQuery = Record<string, unknown>;

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly userRepo: Repository<AdminUserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepo: Repository<RoleMenuEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepo: Repository<DepartmentEntity>,
    @InjectRepository(PositionEntity)
    private readonly positionRepo: Repository<PositionEntity>,
    @InjectRepository(DeptLeaderEntity)
    private readonly deptLeaderRepo: Repository<DeptLeaderEntity>,
    @InjectRepository(UserDeptEntity)
    private readonly userDeptRepo: Repository<UserDeptEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly userPositionRepo: Repository<UserPositionEntity>,
    @InjectRepository(DataPermissionPolicyEntity)
    private readonly policyRepo: Repository<DataPermissionPolicyEntity>,
  ) {}

  async currentUserMenus(user: AdminUser): Promise<Menu[]> {
    const menus = await this.resolveUserMenus(user.id);
    return this.treeMenus(menus);
  }

  async currentUserRoles(user: AdminUser): Promise<Role[]> {
    const roles = await this.resolveUserRoles(user.id);
    return roles.map((role) => this.toRoleDto(role));
  }

  async hasPermission(userId: number, permissionCode: string): Promise<boolean> {
    const roles = await this.resolveUserRoles(userId);
    if (roles.some((role) => role.code === 'SuperAdmin')) {
      return true;
    }

    const roleIds = roles.map((role) => Number(role.id));
    if (roleIds.length === 0) {
      return false;
    }

    const links = await this.roleMenuRepo.find({ where: { role_id: In(roleIds) } });
    const menuIds = [...new Set(links.map((link) => Number(link.menu_id)))];
    if (menuIds.length === 0) {
      return false;
    }

    return this.menuRepo.exists({
      where: {
        id: In(menuIds),
        name: permissionCode,
        status: 1,
      },
    });
  }

  async updateCurrentUser(user: AdminUser, data: ResourceBody): Promise<void> {
    const updateData = this.compact({ ...data });
    if (updateData.new_password !== undefined) {
      const verified = await this.verifyPassword(String(updateData.old_password ?? ''), user.password ?? '');
      if (!verified) {
        throw new UnprocessableEntityException('Old password is incorrect');
      }
      updateData.password = await hash(String(updateData.new_password), 10);
    }

    delete updateData.old_password;
    delete updateData.new_password;
    await this.userRepo.update(user.id, this.pickUserFields(updateData) as any);
  }

  async pageUsers(query: ResourceQuery): Promise<PageList<AdminUser>> {
    const qb = this.userRepo.createQueryBuilder('user');
    this.andLike(qb, 'user.username', query.username);
    this.andLike(qb, 'user.nickname', query.nickname);
    this.andLike(qb, 'user.phone', query.phone);
    this.andLike(qb, 'user.email', query.email);
    if (query.status !== undefined && query.status !== '') {
      qb.andWhere('user.status = :status', { status: Number(query.status) });
    }

    qb.orderBy('user.id', 'DESC');
    const [users, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    const list = await Promise.all(users.map((user) => this.toUserDto(user)));
    return { list, total };
  }

  async createUser(data: ResourceBody): Promise<AdminUser> {
    const user = this.userRepo.create({
      ...this.pickUserFields(data),
      password: await hash(String(data.password || '123456'), 10),
      status: data.status ?? 1,
    });
    const saved = await this.userRepo.save(user);
    await this.syncUserOrg(saved.id, data);
    return this.toUserDto(saved);
  }

  async updateUser(id: number, data: ResourceBody): Promise<void> {
    const exists = await this.userRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const updateData = this.pickUserFields(data);
    if (data.password) {
      updateData.password = await hash(String(data.password), 10);
    }
    await this.userRepo.update(id, updateData as any);
    await this.syncUserOrg(id, data);
  }

  async deleteUsers(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length === 0) {
      return;
    }
    await Promise.all([
      this.userRoleRepo.delete({ user_id: In(ids) }),
      this.userDeptRepo.delete({ user_id: In(ids) }),
      this.userPositionRepo.delete({ user_id: In(ids) }),
      this.userRepo.delete(ids),
    ]);
  }

  async resetUserPassword(id: number): Promise<void> {
    const result = await this.userRepo.update(id, {
      password: await hash('123456', 10),
    });
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const links = await this.userRoleRepo.findBy({ user_id: userId });
    if (links.length === 0) {
      return [];
    }
    const roles = await this.roleRepo.find({
      where: { id: In(links.map((link) => Number(link.role_id))) },
      order: { sort: 'ASC', id: 'ASC' },
    });
    return roles.map((role) => this.toRoleDto(role));
  }

  async setUserRoles(userId: number, roleCodes: string[]): Promise<void> {
    const exists = await this.userRepo.existsBy({ id: userId });
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const roles = roleCodes.length
      ? await this.roleRepo.find({ where: { code: In(roleCodes) } })
      : [];
    await this.userRoleRepo.delete({ user_id: userId });
    if (roles.length > 0) {
      await this.userRoleRepo.save(
        roles.map((role) => this.userRoleRepo.create({ user_id: userId, role_id: role.id })),
      );
    }
  }

  async pageRoles(query: ResourceQuery): Promise<PageList<Role>> {
    const qb = this.roleRepo.createQueryBuilder('role');
    this.andLike(qb, 'role.name', query.name);
    this.andLike(qb, 'role.code', query.code);
    if (query.status !== undefined && query.status !== '') {
      qb.andWhere('role.status = :status', { status: Number(query.status) });
    }

    qb.orderBy('role.sort', 'ASC').addOrderBy('role.id', 'ASC');
    const [roles, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    return { list: roles.map((role) => this.toRoleDto(role)), total };
  }

  async createRole(data: ResourceBody): Promise<Role> {
    const role = await this.roleRepo.save(
      this.roleRepo.create({
        ...this.pickRoleFields(data),
        status: data.status ?? 1,
        sort: data.sort ?? 0,
      }),
    );
    return this.toRoleDto(role);
  }

  async updateRole(id: number, data: ResourceBody): Promise<void> {
    const result = await this.roleRepo.update(id, this.pickRoleFields(data));
    if (!result.affected) {
      throw new NotFoundException('Role not found');
    }
  }

  async deleteRoles(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length === 0) {
      return;
    }
    await Promise.all([
      this.userRoleRepo.delete({ role_id: In(ids) }),
      this.roleMenuRepo.delete({ role_id: In(ids) }),
      this.roleRepo.delete(ids),
    ]);
  }

  async getRolePermissions(id: number): Promise<Array<Pick<Menu, 'id' | 'name'>>> {
    const exists = await this.roleRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException('Role not found');
    }

    const links = await this.roleMenuRepo.findBy({ role_id: id });
    if (links.length === 0) {
      return [];
    }
    const menus = await this.menuRepo.findBy({ id: In(links.map((link) => Number(link.menu_id))) });
    return menus.map((menu) => ({ id: menu.id, name: menu.name }));
  }

  async setRolePermissions(id: number, permissions: string[]): Promise<void> {
    const exists = await this.roleRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException('Role not found');
    }

    const menus = permissions.length
      ? await this.menuRepo.find({ where: { name: In(permissions) } })
      : [];
    await this.roleMenuRepo.delete({ role_id: id });
    if (menus.length > 0) {
      await this.roleMenuRepo.save(
        menus.map((menu) => this.roleMenuRepo.create({ role_id: id, menu_id: menu.id })),
      );
    }
  }

  async listMenus(): Promise<Menu[]> {
    const menus = await this.menuRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
    return this.treeMenus(menus);
  }

  async createMenu(data: ResourceBody): Promise<Menu> {
    const menu = await this.menuRepo.save(
      this.menuRepo.create({
        ...this.pickMenuFields(data),
        parent_id: Number(data.parent_id ?? 0),
        status: data.status ?? 1,
        sort: data.sort ?? 0,
        meta: data.meta ?? { title: data.name, type: 'M' },
      }),
    );
    return this.toMenuDto(menu);
  }

  async updateMenu(id: number, data: ResourceBody): Promise<void> {
    const result = await this.menuRepo.update(id, this.pickMenuFields(data) as any);
    if (!result.affected) {
      throw new NotFoundException('Menu not found');
    }
  }

  async deleteMenus(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length === 0) {
      return;
    }
    const allMenus = await this.menuRepo.find();
    const nestedIds = new Set(ids);
    let changed = true;
    while (changed) {
      changed = false;
      allMenus.forEach((menu) => {
        if (nestedIds.has(Number(menu.parent_id)) && !nestedIds.has(Number(menu.id))) {
          nestedIds.add(Number(menu.id));
          changed = true;
        }
      });
    }

    const deleteIds = [...nestedIds];
    await Promise.all([
      this.roleMenuRepo.delete({ menu_id: In(deleteIds) }),
      this.menuRepo.delete(deleteIds),
    ]);
  }

  async departmentList(query: ResourceQuery): Promise<{ list: Department[] }> {
    const qb = this.departmentRepo.createQueryBuilder('department').where('department.deleted_at IS NULL');
    this.andLike(qb, 'department.name', query.name);
    const departments = await qb.orderBy('department.id', 'ASC').getMany();
    const enriched = await Promise.all(departments.map((department) => this.toDepartmentDto(department)));
    return { list: this.treeDepartments(enriched) };
  }

  async createDepartment(data: ResourceBody): Promise<Department> {
    const department = await this.departmentRepo.save(
      this.departmentRepo.create({
        name: data.name,
        parent_id: Number(data.parent_id ?? 0),
      }),
    );
    return this.toDepartmentDto(department);
  }

  async updateDepartment(id: number, data: ResourceBody): Promise<void> {
    const result = await this.departmentRepo.update(id, {
      name: data.name,
      parent_id: Number(data.parent_id ?? 0),
    });
    if (!result.affected) {
      throw new NotFoundException('Department not found');
    }
  }

  async deleteDepartments(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length === 0) {
      return;
    }
    await this.departmentRepo.update({ id: In(ids) }, { deleted_at: new Date() });
  }

  async pagePositions(query: ResourceQuery): Promise<PageList<Position>> {
    const qb = this.positionRepo.createQueryBuilder('position').where('position.deleted_at IS NULL');
    this.andLike(qb, 'position.name', query.name);
    if (query.dept_id !== undefined && query.dept_id !== '') {
      qb.andWhere('position.dept_id = :deptId', { deptId: Number(query.dept_id) });
    }
    qb.orderBy('position.id', 'DESC');
    const [positions, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    const list = await Promise.all(positions.map((position) => this.toPositionDto(position)));
    return { list, total };
  }

  async createPosition(data: ResourceBody): Promise<Position> {
    const position = await this.positionRepo.save(
      this.positionRepo.create({
        name: data.name,
        dept_id: Number(data.dept_id),
      }),
    );
    return this.toPositionDto(position);
  }

  async updatePosition(id: number, data: ResourceBody): Promise<void> {
    const result = await this.positionRepo.update(id, {
      name: data.name,
      dept_id: Number(data.dept_id),
    });
    if (!result.affected) {
      throw new NotFoundException('Position not found');
    }
  }

  async setPositionDataPermission(id: number, data: ResourceBody): Promise<void> {
    const exists = await this.positionRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException('Position not found');
    }

    const current = await this.policyRepo.findOneBy({ position_id: id, user_id: 0, deleted_at: IsNull() });
    const payload = {
      user_id: 0,
      position_id: id,
      policy_type: String(data.policy_type ?? data.type ?? 'ALL'),
      is_default: data.is_default ?? true,
      value: data.value ?? data,
    };
    if (current) {
      await this.policyRepo.update(current.id, payload);
    } else {
      await this.policyRepo.save(this.policyRepo.create(payload));
    }
  }

  async deletePositions(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length === 0) {
      return;
    }
    await this.positionRepo.update({ id: In(ids) }, { deleted_at: new Date() });
  }

  async pageLeaders(query: ResourceQuery): Promise<PageList<Leader>> {
    const qb = this.deptLeaderRepo.createQueryBuilder('leader').where('leader.deleted_at IS NULL');
    if (query.user_id !== undefined && query.user_id !== '') {
      qb.andWhere('leader.user_id = :userId', { userId: Number(query.user_id) });
    }
    if (query.dept_id !== undefined && query.dept_id !== '') {
      qb.andWhere('leader.dept_id = :deptId', { deptId: Number(query.dept_id) });
    }
    qb.orderBy('leader.dept_id', 'ASC').addOrderBy('leader.user_id', 'ASC');
    const [leaders, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    const list = await Promise.all(leaders.map((leader) => this.toLeaderDto(leader)));
    return { list, total };
  }

  async createLeader(data: ResourceBody): Promise<Leader> {
    const leader = await this.deptLeaderRepo.save(
      this.deptLeaderRepo.create({
        dept_id: Number(data.dept_id),
        user_id: Number(data.user_id),
        deleted_at: null,
      }),
    );
    return this.toLeaderDto(leader);
  }

  async updateLeader(id: number, data: ResourceBody): Promise<void> {
    const result = await this.deptLeaderRepo.update(
      { user_id: id },
      {
        dept_id: Number(data.dept_id),
        user_id: Number(data.user_id ?? id),
      },
    );
    if (!result.affected) {
      throw new NotFoundException('Leader not found');
    }
  }

  async deleteLeaders(body: ResourceBody): Promise<void> {
    const deptId = Number(body.dept_id);
    const userIds = Array.isArray(body.user_ids) ? body.user_ids.map(Number) : [];
    if (!deptId || userIds.length === 0) {
      return;
    }

    await this.deptLeaderRepo.update(
      {
        dept_id: deptId,
        user_id: In(userIds),
      },
      { deleted_at: new Date() },
    );
  }

  private async resolveUserRoles(userId: number): Promise<RoleEntity[]> {
    const links = await this.userRoleRepo.findBy({ user_id: userId });
    if (links.length === 0) {
      return [];
    }

    return this.roleRepo.find({
      where: { id: In(links.map((link) => Number(link.role_id))), status: 1 },
      order: { sort: 'ASC', id: 'ASC' },
    });
  }

  private async resolveUserMenus(userId: number): Promise<MenuEntity[]> {
    const roles = await this.resolveUserRoles(userId);
    if (roles.some((role) => role.code === 'SuperAdmin')) {
      return this.menuRepo.find({
        where: { status: 1 },
        order: { sort: 'ASC', id: 'ASC' },
      });
    }

    const roleIds = roles.map((role) => Number(role.id));
    if (roleIds.length === 0) {
      return [];
    }

    const links = await this.roleMenuRepo.find({
      where: { role_id: In(roleIds) },
    });
    const menuIds = [...new Set(links.map((link) => Number(link.menu_id)))];
    if (menuIds.length === 0) {
      return [];
    }

    const menus = await this.menuRepo.find({
      where: { id: In(menuIds), status: 1 },
      order: { sort: 'ASC', id: 'ASC' },
    });
    return this.includeParents(menus);
  }

  private async includeParents(menus: MenuEntity[]): Promise<MenuEntity[]> {
    const collected = new Map<number, MenuEntity>();
    const all = await this.menuRepo.find({ where: { status: 1 } });
    const allById = new Map(all.map((menu) => [Number(menu.id), menu]));
    menus.forEach((menu) => {
      collected.set(Number(menu.id), menu);
      let parentId = Number(menu.parent_id);
      while (parentId) {
        const parent = allById.get(parentId);
        if (!parent) {
          break;
        }
        collected.set(Number(parent.id), parent);
        parentId = Number(parent.parent_id);
      }
    });
    return [...collected.values()];
  }

  private treeMenus(items: MenuEntity[], parentId = 0): Menu[] {
    return items
      .filter((item) => Number(item.parent_id) === parentId)
      .sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id))
      .map((item) => ({
        ...this.toMenuDto(item),
        children: this.treeMenus(items, Number(item.id)),
      }));
  }

  private treeDepartments(items: Department[], parentId = 0): Department[] {
    return items
      .filter((item) => Number(item.parent_id ?? 0) === parentId)
      .map((item) => ({
        ...item,
        children: this.treeDepartments(items, Number(item.id)),
      }));
  }

  private async toUserDto(user: AdminUserEntity): Promise<AdminUser> {
    const [departments, positions] = await Promise.all([
      this.getUserDepartments(user.id),
      this.getUserPositions(user.id),
    ]);
    const dto = {
      ...this.toUserBrief(user),
      department: departments,
      position: positions,
    } as unknown as AdminUser;
    return dto;
  }

  private toUserBrief(user: AdminUserEntity): AdminUser {
    const dto = { ...user } as unknown as AdminUser;
    delete dto.password;
    return dto;
  }

  private toRoleDto(role: RoleEntity): Role {
    return {
      ...role,
    } as Role;
  }

  private toMenuDto(menu: MenuEntity): Menu {
    return {
      ...menu,
      meta: menu.meta ?? {},
    } as Menu;
  }

  private async toDepartmentDto(department: DepartmentEntity): Promise<Department> {
    const [positions, leaders, departmentUsers] = await Promise.all([
      this.positionRepo.findBy({ dept_id: department.id, deleted_at: IsNull() }),
      this.deptLeaderRepo.findBy({ dept_id: department.id, deleted_at: IsNull() }),
      this.userDeptRepo.findBy({ dept_id: department.id, deleted_at: IsNull() }),
    ]);
    const users = departmentUsers.length
      ? await this.userRepo.findBy({ id: In(departmentUsers.map((item) => Number(item.user_id))) })
      : [];

    return {
      ...department,
      positions: await Promise.all(positions.map((position) => this.toPositionDto(position))),
      leader: await Promise.all(leaders.map((leader) => this.toLeaderDto(leader))),
      department_users: users.map((user) => this.toUserBrief(user)),
      children: [],
    } as Department;
  }

  private async toPositionDto(position: PositionEntity): Promise<Position> {
    const department = await this.departmentRepo.findOneBy({ id: position.dept_id });
    const policy = await this.policyRepo.findOneBy({
      position_id: position.id,
      user_id: 0,
      deleted_at: IsNull(),
    });
    return {
      ...position,
      dept_name: department?.name,
      policy: policy ?? undefined,
    } as Position;
  }

  private async toLeaderDto(leader: DeptLeaderEntity): Promise<Leader> {
    const department = await this.departmentRepo.findOneBy({ id: leader.dept_id });
    return {
      id: Number(leader.user_id),
      user_id: Number(leader.user_id),
      dept_id: Number(leader.dept_id),
      dept_name: department?.name,
      created_at: leader.created_at?.toISOString(),
      updated_at: leader.updated_at?.toISOString(),
      deleted_at: leader.deleted_at?.toISOString() ?? null,
    } as Leader;
  }

  private async getUserDepartments(userId: number): Promise<Department[]> {
    const links = await this.userDeptRepo.findBy({ user_id: userId, deleted_at: IsNull() });
    if (links.length === 0) {
      return [];
    }
    const departments = await this.departmentRepo.findBy({
      id: In(links.map((link) => Number(link.dept_id))),
      deleted_at: IsNull(),
    });
    return departments.map((department) => this.toDepartmentBrief(department));
  }

  private async getUserPositions(userId: number): Promise<Position[]> {
    const links = await this.userPositionRepo.findBy({ user_id: userId, deleted_at: IsNull() });
    if (links.length === 0) {
      return [];
    }
    const positions = await this.positionRepo.findBy({
      id: In(links.map((link) => Number(link.position_id))),
      deleted_at: IsNull(),
    });
    return Promise.all(positions.map((position) => this.toPositionDto(position)));
  }

  private toDepartmentBrief(department: DepartmentEntity): Department {
    return {
      ...department,
      children: [],
    } as Department;
  }

  private async syncUserOrg(userId: number, data: ResourceBody): Promise<void> {
    if (Array.isArray(data.department)) {
      await this.userDeptRepo.delete({ user_id: userId });
      if (data.department.length > 0) {
        await this.userDeptRepo.save(
          data.department.map((departmentId: number) =>
            this.userDeptRepo.create({ user_id: userId, dept_id: Number(departmentId), deleted_at: null }),
          ),
        );
      }
    }

    if (Array.isArray(data.position)) {
      await this.userPositionRepo.delete({ user_id: userId });
      if (data.position.length > 0) {
        await this.userPositionRepo.save(
          data.position.map((positionId: number) =>
            this.userPositionRepo.create({ user_id: userId, position_id: Number(positionId), deleted_at: null }),
          ),
        );
      }
    }
  }

  private pickUserFields(data: ResourceBody): Partial<AdminUserEntity> {
    return this.pick(data, [
      'username',
      'password',
      'user_type',
      'nickname',
      'phone',
      'email',
      'avatar',
      'signed',
      'status',
      'login_ip',
      'login_time',
      'backend_setting',
      'created_by',
      'updated_by',
      'remark',
    ]);
  }

  private pickRoleFields(data: ResourceBody): Partial<RoleEntity> {
    return this.pick(data, ['name', 'code', 'status', 'sort', 'created_by', 'updated_by', 'remark']);
  }

  private pickMenuFields(data: ResourceBody): Partial<MenuEntity> {
    return this.pick(data, [
      'parent_id',
      'name',
      'meta',
      'path',
      'component',
      'redirect',
      'status',
      'sort',
      'created_by',
      'updated_by',
      'remark',
    ]);
  }

  private pick<T extends ResourceBody, K extends keyof T & string>(data: T, keys: K[]): Partial<T> {
    const picked: Partial<T> = {};
    keys.forEach((key) => {
      if (data[key] !== undefined) {
        picked[key] = data[key];
      }
    });
    return this.compact(picked);
  }

  private compact<T extends ResourceBody>(data: T): T {
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });
    return data;
  }

  private normalizeIds(input: unknown): number[] {
    if (Array.isArray(input)) {
      return input.map(Number).filter(Number.isFinite);
    }

    if (typeof input === 'object' && input !== null) {
      const body = input as Record<string, unknown>;
      if (Array.isArray(body.ids)) {
        return body.ids.map(Number).filter(Number.isFinite);
      }
      if (body.id !== undefined) {
        return [Number(body.id)].filter(Number.isFinite);
      }
    }

    return [];
  }

  private skip(query: ResourceQuery): number {
    const page = Number(query.page ?? 1);
    return (Number.isFinite(page) && page > 0 ? page - 1 : 0) * this.take(query);
  }

  private take(query: ResourceQuery): number {
    const pageSize = Number(query.page_size ?? query.per_page ?? 10);
    return Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  }

  private andLike(qb: { andWhere: (condition: string, params?: ResourceBody) => unknown }, column: string, value: unknown): void {
    if (value !== undefined && value !== null && value !== '') {
      const key = column.replace(/\W/g, '_');
      qb.andWhere(`${column} LIKE :${key}`, { [key]: `%${String(value)}%` });
    }
  }

  private async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    if (!passwordHash) {
      return false;
    }
    if (!passwordHash.startsWith('$2')) {
      return password === passwordHash;
    }
    return compare(password, passwordHash.replace(/^\$2y\$/, '$2b$'));
  }
}
