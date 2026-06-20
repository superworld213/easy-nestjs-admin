import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = (code: string): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMISSION_KEY, code);
