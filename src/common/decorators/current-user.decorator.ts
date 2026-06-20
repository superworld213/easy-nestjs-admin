import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { AdminUser } from '../types/entities';

export type RequestWithUser = Request & {
  user?: AdminUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AdminUser | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
