/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';

import { AppConfigModule } from './common/config/config.module';
import { AppLogger } from './common/logger/app-logger';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AppConfigModule, AuthModule, PrismaModule],
  providers: [AppLogger],
})
export class AppModule {}
