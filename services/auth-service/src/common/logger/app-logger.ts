/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

interface LogData {
  timestamp: string;
  level: string;
  message: string;
  traceId?: string;
  method?: string;
  duration?: number | string;
  error?: string;
  success?: boolean;
  [key: string]: unknown;
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  constructor(context?: string) {
    super(context || 'AppLogger');
  }

  protected printMessages(
    messages: unknown[],
    _context?: string,
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stderr' | 'stdout',
  ): void {
    const logData = Array.isArray(messages) ? messages[0] : messages;

    const logEntry: LogData = {
      timestamp: new Date().toISOString(),
      level: logLevel === 'log' ? 'info' : logLevel,
      message: typeof logData === 'string' ? logData : 'gRPC Request',
    };

    if (typeof logData === 'object' && logData !== null) {
      const data = logData as Record<string, unknown>;

      if (data.traceId) logEntry.traceId = data.traceId as string;
      if (data.method) logEntry.method = data.method as string;
      if (data.duration) logEntry.duration = data.duration as number | string;
      if (data.error) logEntry.error = data.error as string;
      if (data.success !== undefined) logEntry.success = data.success as boolean;

      if (data.message && typeof data.message === 'string') {
        logEntry.message = data.message;
      }

      Object.keys(data).forEach((key) => {
        if (!(key in logEntry)) {
          (logEntry as Record<string, unknown>)[key] = data[key];
        }
      });
    }

    const stream = writeStreamType === 'stderr' ? process.stderr : process.stdout;
    stream.write(JSON.stringify(logEntry) + '\n');
  }
}
