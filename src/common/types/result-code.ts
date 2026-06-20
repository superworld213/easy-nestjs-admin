export enum ResultCode {
  SUCCESS = 200,
  FAIL = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  UNPROCESSABLE_ENTITY = 422,
  DISABLED = 423,
}

export function resultMessage(code: ResultCode): string {
  switch (code) {
    case ResultCode.SUCCESS:
      return 'success';
    case ResultCode.UNAUTHORIZED:
      return 'unauthorized';
    case ResultCode.FORBIDDEN:
      return 'forbidden';
    case ResultCode.NOT_FOUND:
      return 'not found';
    case ResultCode.METHOD_NOT_ALLOWED:
      return 'method not allowed';
    case ResultCode.NOT_ACCEPTABLE:
      return 'not acceptable';
    case ResultCode.UNPROCESSABLE_ENTITY:
      return 'unprocessable entity';
    case ResultCode.DISABLED:
      return 'disabled';
    default:
      return 'fail';
  }
}
