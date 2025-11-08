/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { RpcToHttpExceptionFilter } from './common/filters/rpc-to-http-exception.filter';
import { AppLogger } from './common/logger/app-logger';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  app.useLogger(app.get(AppLogger));
  const configService = app.get(ConfigService);
  const corsAllowedHeaders = configService.get<string>('CORS_ALLOWED_HEADERS');
  const corsCredentials = configService.get<boolean>('CORS_CREDENTIALS') ?? true;
  const corsExposedHeaders = configService.get<string>('CORS_EXPOSED_HEADERS');
  const corsMethods = (configService.get<string>('CORS_METHODS') ?? '').split(', ');
  const corsOrigins = (configService.get<string>('CORS_ORIGINS') ?? '').split(', ');

  app.enableCors({
    allowedHeaders: corsAllowedHeaders,
    credentials: corsCredentials,
    exposedHeaders: corsExposedHeaders,
    methods: corsMethods,
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      callback(null, true);
    },
  });

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('AI Review Backend API')
      .setDescription('API documentation for the AI Review Backend')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {},
  });

  const port = configService.get<number>('PORT') ?? 3000;
  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(port);
  const logger = app.get(AppLogger);
  logger.log(`Logger enabled`);
  logger.log(`CORS allowed headers: ${corsAllowedHeaders}`);
  logger.log(`CORS credentials: ${corsCredentials}`);
  logger.log(`CORS exposed headers: ${corsExposedHeaders}`);
  logger.log(`CORS methods: ${corsMethods.join(', ')}`);
  logger.log(`CORS origins: ${corsOrigins.join(', ')}`);
  logger.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
