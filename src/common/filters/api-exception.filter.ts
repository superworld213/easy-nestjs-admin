import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { error } from '../types/api-response';
import { ResultCode } from '../types/result-code';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { code, message } = this.resolveException(exception);

    response.status(HttpStatus.OK).json(error(code, message));
  }

  private resolveException(exception: unknown): { code: ResultCode; message: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      return {
        code: this.mapStatus(status),
        message: this.resolveMessage(payload, exception.message),
      };
    }

    if (exception instanceof Error) {
      return {
        code: ResultCode.FAIL,
        message: exception.message || 'Server error',
      };
    }

    return {
      code: ResultCode.FAIL,
      message: 'Server error',
    };
  }

  private mapStatus(status: number): ResultCode {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ResultCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ResultCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ResultCode.NOT_FOUND;
      case HttpStatus.METHOD_NOT_ALLOWED:
        return ResultCode.METHOD_NOT_ALLOWED;
      case HttpStatus.NOT_ACCEPTABLE:
        return ResultCode.NOT_ACCEPTABLE;
      case HttpStatus.UNPROCESSABLE_ENTITY:
      case HttpStatus.BAD_REQUEST:
        return ResultCode.UNPROCESSABLE_ENTITY;
      case HttpStatus.LOCKED:
        return ResultCode.DISABLED;
      default:
        return ResultCode.FAIL;
    }
  }

  private resolveMessage(payload: string | object, fallback: string): string {
    if (typeof payload === 'string') {
      return payload;
    }

    if ('message' in payload) {
      const message = (payload as { message?: string | string[] }).message;
      return Array.isArray(message) ? message.join('; ') : message || fallback;
    }

    return fallback;
  }
}
