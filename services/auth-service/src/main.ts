/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: new AppLogger('AuthMicroservice'),
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../proto/auth.proto'),
      url: '0.0.0.0:50051',
    },
  });
  await app.listen();
  app.useLogger(app.get(AppLogger));
  const logger = new AppLogger('bootstrap');
  logger.log('Auth microservice is listening');
}
void bootstrap();
