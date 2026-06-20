import { ResultCode, resultMessage } from './result-code';

export interface ApiResult<T = unknown> {
  code: ResultCode;
  message: string;
  data: T;
}

export function success<T = unknown>(data: T): ApiResult<T> {
  return {
    code: ResultCode.SUCCESS,
    message: resultMessage(ResultCode.SUCCESS),
    data,
  };
}

export function error<T = unknown>(
  code: ResultCode = ResultCode.FAIL,
  message = resultMessage(code),
  data: T | [] = [],
): ApiResult<T | []> {
  return {
    code,
    message,
    data,
  };
}
