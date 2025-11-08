/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: new AppLogger('AuthMicroservice'),
    options: {
      package: 'auth',
      protoPath: join('/app', 'proto', 'auth.proto'),
      url: '0.0.0.0:50051',
    },
    transport: Transport.GRPC,
  });
  await app.listen();
  app.useLogger(app.get(AppLogger));
  const logger = new AppLogger('bootstrap');
  logger.log('Auth microservice is listening');
}
void bootstrap();
