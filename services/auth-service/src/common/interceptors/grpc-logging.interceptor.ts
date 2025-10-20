/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppLogger } from '../logger/app-logger';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger('GRPC');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToRpc();
    const method: string = context.getHandler().name;
    const metadata: Metadata = ctx.getContext();
    const data: unknown = ctx.getData();
    const traceId = metadata.get('x-trace-id')?.[0] ?? '';
    const startTime = Date.now();
    const sanitizedData = this.sanitizeRequestBody(data);

    const logData = {
      message: 'INCOMING REQUEST',
      traceId,
      method,
      body: sanitizedData,
    };

    this.logger.log(logData);

    return next.handle().pipe(
      tap({
        finalize: () => {
          const duration = Date.now() - startTime;
          const responseLogData = {
            message: 'PERFORMANCE',
            traceId,
            elapsed: `${duration}ms`,
          };

          this.logger.log(responseLogData);
        },
        error: (error: Error) => {
          const errorLogData = {
            traceId,
            ...error,
            message: 'ERROR',
          };

          this.logger.error(errorLogData);
        },
      }),
    );
  }

  private sanitizeRequestBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized: Record<string, unknown> = { ...body };

    if (sanitized.password) {
      sanitized.password = '[REDACTED]';
    }

    return sanitized;
  }
}
