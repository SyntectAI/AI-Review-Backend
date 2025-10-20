/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
      message: `INCOMING REQUEST`,
      traceId,
      method: request.method,
      url: request.originalUrl,
      userAgent: request.headers['user-agent'] || '',
      ip: request.ip || request.connection.remoteAddress,
      body: sanitizedBody,
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
