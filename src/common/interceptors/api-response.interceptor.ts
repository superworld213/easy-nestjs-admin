import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { ApiResult, success } from '../types/api-response';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResult<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (this.isApiResult(data)) {
          return data;
        }

        return success(data ?? []);
      }),
    );
  }

  private isApiResult(data: unknown): data is ApiResult<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'code' in data &&
      'message' in data &&
      'data' in data
    );
  }
}
