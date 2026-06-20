import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { In, Repository } from 'typeorm';

import { AdminUserEntity } from '../entities/admin-user.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { MenuEntity } from '../entities/menu.entity';
import { PositionEntity } from '../entities/position.entity';
import { RoleEntity } from '../entities/role.entity';
import { RoleMenuEntity } from '../entities/role-menu.entity';
import { UserDeptEntity } from '../entities/user-dept.entity';
import { UserPositionEntity } from '../entities/user-position.entity';
import { UserRoleEntity } from '../entities/user-role.entity';

interface SeedMenu {
  name: string;
  parent?: string;
  path?: string;
  component?: string;
  redirect?: string;
  sort?: number;
  meta: Record<string, unknown>;
}

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

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
    @InjectRepository(UserDeptEntity)
    private readonly userDeptRepo: Repository<UserDeptEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly userPositionRepo: Repository<UserPositionEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if ((process.env.DB_SEED ?? 'true') !== 'true') {
      return;
    }

    const [admin, role] = await Promise.all([this.ensureAdmin(), this.ensureSuperAdminRole()]);
    const menus = await this.ensureMenus();
    await Promise.all([
      this.ensureUserRole(admin.id, role.id),
      this.ensureRoleMenus(role.id, menus.map((menu) => menu.id)),
      this.ensureOrg(admin.id),
    ]);

    this.logger.log('Database seed check complete');
  }

  private async ensureAdmin(): Promise<AdminUserEntity> {
    const exists = await this.userRepo.findOneBy({ username: 'admin' });
    if (exists) {
      return exists;
    }

    const password = await hash('123456', 10);
    return this.userRepo.save(
      this.userRepo.create({
        username: 'admin',
        password,
        user_type: '100',
        nickname: 'Admin',
        email: 'admin@example.com',
        phone: '',
        signed: 'MineAdmin NestJS',
        status: 1,
        login_ip: '127.0.0.1',
        login_time: new Date(),
        backend_setting: {},
        created_by: 0,
        updated_by: 0,
        remark: 'Seed administrator',
      }),
    );
  }

  private async ensureSuperAdminRole(): Promise<RoleEntity> {
    const exists = await this.roleRepo.findOneBy({ code: 'SuperAdmin' });
    if (exists) {
      return exists;
    }

    return this.roleRepo.save(
      this.roleRepo.create({
        name: 'Super Admin',
        code: 'SuperAdmin',
        status: 1,
        sort: 1,
        created_by: 0,
        updated_by: 0,
        remark: 'Seed super administrator role',
      }),
    );
  }

  private async ensureMenus(): Promise<MenuEntity[]> {
    const seedMenus = this.seedMenus();
    const existing = await this.menuRepo.find({
      where: { name: In(seedMenus.map((menu) => menu.name)) },
    });
    const existingByName = new Map(existing.map((menu) => [menu.name, menu]));
    const createdOrExisting = new Map<string, MenuEntity>();

    for (const seedMenu of seedMenus) {
      const existingMenu = existingByName.get(seedMenu.name);
      if (existingMenu) {
        createdOrExisting.set(seedMenu.name, existingMenu);
        continue;
      }

      const parent = seedMenu.parent ? createdOrExisting.get(seedMenu.parent) : undefined;
      const menu = await this.menuRepo.save(
        this.menuRepo.create({
          parent_id: parent?.id ?? 0,
          name: seedMenu.name,
          path: seedMenu.path ?? '',
          component: seedMenu.component ?? '',
          redirect: seedMenu.redirect ?? '',
          status: 1,
          sort: seedMenu.sort ?? 0,
          meta: seedMenu.meta,
          created_by: 0,
          updated_by: 0,
          remark: '',
        }),
      );
      createdOrExisting.set(seedMenu.name, menu);
    }

    return this.menuRepo.find();
  }

  private async ensureUserRole(userId: number, roleId: number): Promise<void> {
    const exists = await this.userRoleRepo.findOneBy({ user_id: userId, role_id: roleId });
    if (!exists) {
      await this.userRoleRepo.save(this.userRoleRepo.create({ user_id: userId, role_id: roleId }));
    }
  }

  private async ensureRoleMenus(roleId: number, menuIds: number[]): Promise<void> {
    if (menuIds.length === 0) {
      return;
    }

    const exists = await this.roleMenuRepo.find({
      where: { role_id: roleId, menu_id: In(menuIds) },
    });
    const existingIds = new Set(exists.map((item) => Number(item.menu_id)));
    const missing = menuIds
      .filter((menuId) => !existingIds.has(Number(menuId)))
      .map((menuId) => this.roleMenuRepo.create({ role_id: roleId, menu_id: menuId }));

    if (missing.length > 0) {
      await this.roleMenuRepo.save(missing);
    }
  }

  private async ensureOrg(userId: number): Promise<void> {
    let department = await this.departmentRepo.findOneBy({ name: 'Headquarters' });
    if (!department) {
      department = await this.departmentRepo.save(
        this.departmentRepo.create({
          name: 'Headquarters',
          parent_id: 0,
        }),
      );
    }

    let position = await this.positionRepo.findOneBy({ name: 'Administrator', dept_id: department.id });
    if (!position) {
      position = await this.positionRepo.save(
        this.positionRepo.create({
          name: 'Administrator',
          dept_id: department.id,
        }),
      );
    }

    const userDept = await this.userDeptRepo.findOneBy({ user_id: userId, dept_id: department.id });
    if (!userDept) {
      await this.userDeptRepo.save(this.userDeptRepo.create({ user_id: userId, dept_id: department.id }));
    }

    const userPosition = await this.userPositionRepo.findOneBy({
      user_id: userId,
      position_id: position.id,
    });
    if (!userPosition) {
      await this.userPositionRepo.save(
        this.userPositionRepo.create({ user_id: userId, position_id: position.id }),
      );
    }
  }

  private seedMenus(): SeedMenu[] {
    return [
      this.menu('permission', undefined, '/permission', '', '/permission/user', 10, {
        title: 'Permission',
        icon: 'carbon:user-role',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      this.menu('permission:user', 'permission', '/permission/user', 'base/views/permission/user/index', '', 10, {
        title: 'Users',
        icon: 'material-symbols:manage-accounts-outline',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      ...this.buttonMenus('permission:user', [
        'permission:user:index',
        'permission:user:save',
        'permission:user:update',
        'permission:user:delete',
        'permission:user:password',
        'permission:user:getRole',
        'permission:user:setRole',
      ]),
      this.menu('permission:role', 'permission', '/permission/role', 'base/views/permission/role/index', '', 20, {
        title: 'Roles',
        icon: 'material-symbols:supervisor-account-outline-rounded',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      ...this.buttonMenus('permission:role', [
        'permission:role:index',
        'permission:role:save',
        'permission:role:update',
        'permission:role:delete',
        'permission:role:getMenu',
        'permission:role:setMenu',
      ]),
      this.menu('permission:menu', 'permission', '/permission/menu', 'base/views/permission/menu/index', '', 30, {
        title: 'Menus',
        icon: 'ph:list-bold',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      ...this.buttonMenus('permission:menu', [
        'permission:menu:index',
        'permission:menu:create',
        'permission:menu:save',
        'permission:menu:delete',
      ]),
      this.menu(
        'permission:department',
        'permission',
        '/permission/department',
        'base/views/permission/department/index',
        '',
        40,
        {
          title: 'Departments',
          icon: 'mingcute:department-line',
          type: 'M',
          breadcrumbEnable: true,
          copyright: true,
          cache: true,
        },
      ),
      ...this.buttonMenus('permission:department', [
        'permission:department:index',
        'permission:department:save',
        'permission:department:update',
        'permission:department:delete',
        'permission:position:index',
        'permission:position:save',
        'permission:position:update',
        'permission:position:delete',
        'permission:position:data_permission',
        'permission:leader:index',
        'permission:leader:save',
        'permission:leader:delete',
      ]),
      this.menu('dataCenter', undefined, '/data-center', '', '/data-center/attachment', 20, {
        title: 'Data Center',
        icon: 'mdi:database-outline',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      this.menu(
        'dataCenter:attachment',
        'dataCenter',
        '/data-center/attachment',
        'base/views/dataCenter/attachment/index',
        '',
        10,
        {
          title: 'Attachments',
          icon: 'mdi:attachment',
          type: 'M',
          breadcrumbEnable: true,
          copyright: true,
          cache: true,
        },
      ),
      ...this.buttonMenus('dataCenter:attachment', [
        'dataCenter:attachment:list',
        'dataCenter:attachment:upload',
        'dataCenter:attachment:delete',
      ]),
      this.menu('log', undefined, '/log', '', '/log/user-login', 30, {
        title: 'Logs',
        icon: 'ph:list-magnifying-glass',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      this.menu('log:userLogin', 'log', '/log/user-login', 'base/views/log/userLogin', '', 10, {
        title: 'Login Logs',
        icon: 'ph:user-list',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      ...this.buttonMenus('log:userLogin', ['log:userLogin:list', 'log:userLogin:delete']),
      this.menu('log:userOperation', 'log', '/log/user-operation', 'base/views/log/userOperation', '', 20, {
        title: 'Operation Logs',
        icon: 'ph:list-magnifying-glass',
        type: 'M',
        breadcrumbEnable: true,
        copyright: true,
        cache: true,
      }),
      ...this.buttonMenus('log:userOperation', ['log:userOperation:list', 'log:userOperation:delete']),
    ];
  }

  private menu(
    name: string,
    parent: string | undefined,
    path: string,
    component: string,
    redirect: string,
    sort: number,
    meta: Record<string, unknown>,
  ): SeedMenu {
    return {
      name,
      parent,
      path,
      component,
      redirect,
      sort,
      meta,
    };
  }

  private buttonMenus(parent: string, names: string[]): SeedMenu[] {
    return names.map((name, index) => ({
      name,
      parent,
      sort: index + 1,
      meta: {
        title: name,
        type: 'B',
      },
    }));
  }
}
