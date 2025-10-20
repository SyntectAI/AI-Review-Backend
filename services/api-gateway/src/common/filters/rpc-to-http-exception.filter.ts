/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface RpcError {
  code: number;
  details?: string;
  message?: string;
}

interface BadRequestExceptionDetails {
  message?: string;
  details?: Array<{ field: string; message: string }>;
  [key: string]: any;
}

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcToHttpExceptionFilter.name);
  private static readonly grpcToHttpStatus: Record<number, number> = {
    [GrpcStatus.OK]: HttpStatus.OK,
    [GrpcStatus.CANCELLED]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
    [GrpcStatus.ABORTED]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  catch(exception: HttpException | RpcError, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus() as HttpStatus;
      const exceptionResponse = exception.getResponse();
      const error: Record<string, unknown> = {
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
      };

      this.logger.error(`HttpException: ${status} ${exception.message}`);

      if (status === HttpStatus.BAD_REQUEST) {
        error.details = (exceptionResponse as BadRequestExceptionDetails).details;
      }

      return response.status(status).json(error);
    }

    const message = exception.details || exception.message || 'An unexpected error occurred.';
    const httpStatus =
      RpcToHttpExceptionFilter.grpcToHttpStatus[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(httpStatus)
      .json({
        statusCode: httpStatus,
        message,
        timestamp: new Date().toISOString(),
      })
      .on('finish', () => {
        this.logger.error({
          message: 'ERROR',
          error: {
            code: httpStatus,
            message,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            traceId: request.headers['x-trace-id'],
          },
          timestamp: new Date().toISOString(),
        });
      });
  }
}
