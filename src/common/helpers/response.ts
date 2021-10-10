import { HttpStatus } from '@nestjs/common';

export class SuccessResponse {
  constructor(data = {}) {
    return {
      code: HttpStatus.OK,
      message: 'Success',
      data,
    };
  }
}

export class ErrorResponse {
  constructor(
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors = [],
  ) {
    return {
      code,
      message,
      errors,
    };
  }
}
