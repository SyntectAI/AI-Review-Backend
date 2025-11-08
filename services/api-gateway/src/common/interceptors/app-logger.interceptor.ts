/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { randomUUID } from 'node:crypto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { type Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppLogger } from '../logger/app-logger';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger('GRPC');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const traceId = randomUUID();
    const startTime = Date.now();
    const sanitizedBody = this.sanitizeRequestBody(request.body);

    request.headers['x-trace-id'] = traceId;

    const logData = {
      body: sanitizedBody,
      ip: request.ip || request.connection.remoteAddress,
      message: `INCOMING REQUEST`,
      method: request.method,
      traceId,
      url: request.originalUrl,
      userAgent: request.headers['user-agent'] || '',
    };

    this.logger.log(logData);

    return next.handle().pipe(
      tap({
        finalize: () => {
          const duration = Date.now() - startTime;
          const responseLogData = {
            elapsed: `${duration}ms`,
            message: 'PERFORMANCE',
            traceId,
          };

          this.logger.log(responseLogData);
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
