import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

import {
  AdminUser,
  Attachment,
  BaseRecord,
  Department,
  Leader,
  Menu,
  PageList,
  Position,
  Role,
  UserLoginLog,
  UserOperationLog,
} from '../types/entities';

type Query = Record<string, unknown>;
type TreeRecord = { id: number; parent_id?: number | null; sort?: number; children?: unknown[] };

@Injectable()
export class MemoryStoreService {
  users: AdminUser[] = [];
  roles: Role[] = [];
  menus: Menu[] = [];
  departments: Department[] = [];
  positions: Position[] = [];
  leaders: Leader[] = [];
  attachments: Attachment[] = [];
  userLoginLogs: UserLoginLog[] = [];
  userOperationLogs: UserOperationLog[] = [];
  userRoles = new Map<number, string[]>();
  rolePermissions = new Map<number, string[]>();

  private sequence = new Map<string, number>();

  constructor() {
    this.seed();
  }

  now(): string {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
  }

  page<T>(items: T[], query: Query = {}): PageList<T> {
    const currentPage = this.toPositiveInt(query.page, 1);
    const pageSize = this.toPositiveInt(query.page_size ?? query.per_page, 10);
    const start = (currentPage - 1) * pageSize;

    return {
      list: items.slice(start, start + pageSize),
      total: items.length,
    };
  }

  filter<T extends Record<string, unknown>>(
    items: T[],
    query: Query,
    searchableKeys: Array<keyof T & string>,
  ): T[] {
    return items.filter((item) =>
      searchableKeys.every((key) => {
        const expected = query[key];
        if (expected === undefined || expected === null || expected === '') {
          return true;
        }

        const actual = item[key];
        if (typeof actual === 'string') {
          return actual.toLowerCase().includes(String(expected).toLowerCase());
        }

        return String(actual) === String(expected);
      }),
    );
  }

  create<T extends BaseRecord>(collection: T[], sequenceKey: string, data: Partial<T>): T {
    const entity = {
      ...data,
      id: this.nextId(sequenceKey),
      created_at: this.now(),
      updated_at: this.now(),
      deleted_at: null,
    } as T;

    collection.push(entity);
    return entity;
  }

  update<T extends BaseRecord>(collection: T[], id: number, data: Partial<T>): T | null {
    const entity = collection.find((item) => item.id === id);
    if (!entity) {
      return null;
    }

    Object.assign(entity, data, {
      updated_at: this.now(),
    });
    return entity;
  }

  removeByIds<T extends BaseRecord>(collection: T[], input: unknown): T[] {
    const ids = this.normalizeIds(input);
    return collection.filter((item) => !ids.includes(item.id));
  }

  normalizeIds(input: unknown): number[] {
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

  tree<T extends TreeRecord>(items: T[], parentId: number | null = 0): T[] {
    return items
      .filter((item) => (item.parent_id ?? 0) === parentId)
      .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
      .map((item) => {
        const children = this.tree(items, item.id);
        return {
          ...item,
          children,
        };
      });
  }

  getUserById(id: number): AdminUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByUsername(username: string): AdminUser | undefined {
    return this.users.find((user) => user.username === username);
  }

  getRoleByCode(code: string): Role | undefined {
    return this.roles.find((role) => role.code === code);
  }

  getRoleById(id: number): Role | undefined {
    return this.roles.find((role) => role.id === id);
  }

  hashFileName(name: string, size = 0): string {
    return createHash('sha1').update(`${name}:${size}:${Date.now()}`).digest('hex');
  }

  private toPositiveInt(value: unknown, fallback: number): number {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) && numberValue > 0 ? Math.floor(numberValue) : fallback;
  }

  private nextId(key: string): number {
    const next = (this.sequence.get(key) ?? 0) + 1;
    this.sequence.set(key, next);
    return next;
  }

  private seed(): void {
    const timestamp = this.now();

    this.departments = [
      {
        id: 1,
        name: 'Headquarters',
        parent_id: null,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
        remark: 'Default department',
      },
    ];

    this.positions = [
      {
        id: 1,
        dept_id: 1,
        dept_name: 'Headquarters',
        name: 'Administrator',
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];

    this.users = [
      {
        id: 1,
        username: 'admin',
        password: '123456',
        user_type: 100,
        nickname: 'Admin',
        phone: '',
        email: 'admin@example.com',
        avatar: '',
        signed: 'MineAdmin NestJS',
        dashboard: '/dashboard/workbench',
        status: 1,
        login_ip: '127.0.0.1',
        login_time: timestamp,
        backend_setting: {},
        department: this.departments,
        position: this.positions,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];

    this.roles = [
      {
        id: 1,
        name: 'Super Admin',
        code: 'SuperAdmin',
        data_scope: 1,
        status: 1,
        sort: 1,
        remark: 'Built-in development administrator',
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];

    this.menus = this.seedMenus(timestamp);
    this.leaders = [
      {
        id: 1,
        dept_id: 1,
        dept_name: 'Headquarters',
        user_id: 1,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];
    this.attachments = [];
    this.userLoginLogs = [
      {
        id: 1,
        username: 'admin',
        ip: '127.0.0.1',
        os: 'unknown',
        browser: 'unknown',
        status: 1,
        message: 'Seed login log',
        login_time: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];
    this.userOperationLogs = [
      {
        id: 1,
        username: 'admin',
        method: 'GET',
        router: '/admin/permission/menus',
        service_name: 'Permission menus',
        ip: '127.0.0.1',
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ];

    this.userRoles.set(1, ['SuperAdmin']);
    this.rolePermissions.set(
      1,
      this.menus.map((menu) => menu.name),
    );

    this.sequence = new Map([
      ['users', 1],
      ['roles', 1],
      ['menus', this.menus.length],
      ['departments', 1],
      ['positions', 1],
      ['leaders', 1],
      ['attachments', 0],
      ['userLoginLogs', 1],
      ['userOperationLogs', 1],
    ]);
  }

  private seedMenus(timestamp: string): Menu[] {
    const records: Menu[] = [
      {
        id: 1,
        parent_id: 0,
        name: 'permission',
        path: '/permission',
        redirect: '/permission/user',
        sort: 10,
        status: 1,
        meta: { title: 'Permission', icon: 'carbon:user-role', type: 'M' },
      },
      {
        id: 2,
        parent_id: 1,
        name: 'permission:user',
        path: '/permission/user',
        component: 'base/views/permission/user/index',
        sort: 10,
        status: 1,
        meta: { title: 'Users', icon: 'ph:users', type: 'M', cache: true },
      },
      {
        id: 3,
        parent_id: 1,
        name: 'permission:role',
        path: '/permission/role',
        component: 'base/views/permission/role/index',
        sort: 20,
        status: 1,
        meta: { title: 'Roles', icon: 'eos-icons:role-binding', type: 'M', cache: true },
      },
      {
        id: 4,
        parent_id: 1,
        name: 'permission:menu',
        path: '/permission/menu',
        component: 'base/views/permission/menu/index',
        sort: 30,
        status: 1,
        meta: { title: 'Menus', icon: 'material-symbols:menu', type: 'M', cache: true },
      },
      {
        id: 5,
        parent_id: 1,
        name: 'permission:department',
        path: '/permission/department',
        component: 'base/views/permission/department/index',
        sort: 40,
        status: 1,
        meta: { title: 'Departments', icon: 'mingcute:department-line', type: 'M', cache: true },
      },
      {
        id: 6,
        parent_id: 0,
        name: 'dataCenter',
        path: '/data-center',
        redirect: '/data-center/attachment',
        sort: 20,
        status: 1,
        meta: { title: 'Data Center', icon: 'mdi:database-outline', type: 'M' },
      },
      {
        id: 7,
        parent_id: 6,
        name: 'dataCenter:attachment',
        path: '/data-center/attachment',
        component: 'base/views/dataCenter/attachment/index',
        sort: 10,
        status: 1,
        meta: { title: 'Attachments', icon: 'mdi:attachment', type: 'M', cache: true },
      },
      {
        id: 8,
        parent_id: 0,
        name: 'log',
        path: '/log',
        redirect: '/log/user-login',
        sort: 30,
        status: 1,
        meta: { title: 'Logs', icon: 'ph:list-magnifying-glass', type: 'M' },
      },
      {
        id: 9,
        parent_id: 8,
        name: 'log:userLogin',
        path: '/log/user-login',
        component: 'base/views/log/userLogin',
        sort: 10,
        status: 1,
        meta: { title: 'Login Logs', icon: 'mdi:login', type: 'M', cache: true },
      },
      {
        id: 10,
        parent_id: 8,
        name: 'log:userOperation',
        path: '/log/user-operation',
        component: 'base/views/log/userOperation',
        sort: 20,
        status: 1,
        meta: { title: 'Operation Logs', icon: 'icon-park-outline:log', type: 'M', cache: true },
      },
      ...this.buttonMenus(2, 100, [
        'permission:user:index',
        'permission:user:save',
        'permission:user:update',
        'permission:user:delete',
        'permission:user:password',
        'permission:user:getRole',
        'permission:user:setRole',
      ]),
      ...this.buttonMenus(3, 200, [
        'permission:role:index',
        'permission:role:save',
        'permission:role:update',
        'permission:role:delete',
        'permission:role:getMenu',
        'permission:role:setMenu',
      ]),
      ...this.buttonMenus(4, 300, [
        'permission:menu:index',
        'permission:menu:create',
        'permission:menu:save',
        'permission:menu:delete',
      ]),
      ...this.buttonMenus(5, 400, [
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
      ...this.buttonMenus(7, 500, [
        'dataCenter:attachment:list',
        'dataCenter:attachment:upload',
        'dataCenter:attachment:delete',
      ]),
      ...this.buttonMenus(9, 600, ['log:userLogin:list', 'log:userLogin:delete']),
      ...this.buttonMenus(10, 700, ['log:userOperation:list', 'log:userOperation:delete']),
    ];

    return records.map((record) => ({
      ...record,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    }));
  }

  private buttonMenus(parentId: number, startId: number, codes: string[]): Menu[] {
    return codes.map((code, index) => ({
      id: startId + index,
      parent_id: parentId,
      name: code,
      path: '',
      sort: index + 1,
      status: 1,
      meta: {
        title: code,
        type: 'B',
      },
    }));
  }
}
