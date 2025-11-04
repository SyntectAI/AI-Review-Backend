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
  service?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  email?: string;
  error?: string;
  success?: boolean;
  [key: string]: unknown;
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  constructor(context?: string) {
    super(context || 'AppLogger');
  }

  // biome-ignore lint/nursery/useMaxParams: <Nest.js ConsoleLogger method accepts up to 4 parameters>
  protected printMessages(
    messages: unknown[],
    _context?: string,
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stderr' | 'stdout',
  ): void {
    const logData = Array.isArray(messages) ? messages[0] : messages;

    const logEntry: LogData = {
      level: logLevel === 'log' ? 'info' : logLevel,
      message: typeof logData === 'string' ? logData : 'HTTP Request',
      timestamp: new Date().toISOString(),
    };

    if (typeof logData === 'object' && logData !== null) {
      const data = logData as Record<string, unknown>;

      if (data.traceId) logEntry.traceId = data.traceId as string;
      if (data.method) logEntry.method = data.method as string;
      if (data.url) logEntry.url = data.url as string;
      if (data.statusCode) logEntry.statusCode = data.statusCode as number;
      if (data.duration) logEntry.duration = data.duration as number;
      if (data.userAgent) logEntry.userAgent = data.userAgent as string;
      if (data.ip) logEntry.ip = data.ip as string;
      if (data.userId) logEntry.userId = data.userId as string;
      if (data.email) logEntry.email = data.email as string;
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
    stream.write(`${JSON.stringify(logEntry)}\n`);
  }
}
