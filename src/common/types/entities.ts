export interface PageList<T> {
  list: T[];
  total: number;
}

export interface BaseRecord {
  id: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
  created_by?: number;
  updated_by?: number;
  remark?: string;
  [key: string]: unknown;
}

export interface Role extends BaseRecord {
  name: string;
  code: string;
  data_scope?: number;
  status?: number;
  sort?: number;
}

export interface Menu extends BaseRecord {
  parent_id: number;
  name: string;
  path?: string;
  component?: string;
  redirect?: string;
  status?: number;
  sort?: number;
  meta: {
    title?: string;
    i18n?: string;
    icon?: string;
    type?: string;
    hidden?: boolean;
    cache?: boolean;
    breadcrumbEnable?: boolean;
    copyright?: boolean;
    componentSuffix?: string;
    auth?: string[];
    role?: string[];
    user?: string[];
    [key: string]: unknown;
  };
  children?: Menu[];
  btnPermission?: Menu[];
}

export interface Department extends BaseRecord {
  name: string;
  parent_id?: number | null;
  children?: Department[];
  leader?: Leader[];
  positions?: Position[];
  department_users?: AdminUser[];
}

export interface Position extends BaseRecord {
  dept_id?: number;
  dept_name?: string;
  name: string;
  policy?: unknown;
}

export interface Leader extends BaseRecord {
  dept_id: number;
  dept_name?: string;
  user_id: number | null;
}

export interface Attachment extends BaseRecord {
  storage_mode: string;
  origin_name: string;
  object_name: string;
  hash: string;
  mime_type: string;
  storage_path: string;
  suffix: string;
  size_byte: number;
  size_info: string;
  url: string;
  current_user_id?: number;
}

export interface AdminUser extends BaseRecord {
  username: string;
  password?: string;
  user_type?: number | string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  signed?: string;
  dashboard?: string;
  status?: 1 | 2;
  login_ip?: string;
  login_time?: string;
  backend_setting?: Record<string, unknown>;
  department?: Department[];
  position?: Position[];
}

export interface UserLoginLog extends BaseRecord {
  username: string;
  ip: string;
  os: string;
  browser: string;
  status: number;
  message: string;
  login_time: string | Date;
}

export interface UserOperationLog extends BaseRecord {
  username: string;
  method: string;
  router: string;
  service_name: string;
  ip: string;
}

export interface TokenSession {
  userId: number;
  expiresAt: number;
  tokenType: 'access' | 'refresh';
}
