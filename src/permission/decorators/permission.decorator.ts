import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export interface PermissionOptions {
  code: string | string[];
  operation?: 'and' | 'or';
}

export const Permission = (code: string | string[], operation: 'and' | 'or' = 'and') =>
  SetMetadata(PERMISSION_KEY, { code, operation } as PermissionOptions);
