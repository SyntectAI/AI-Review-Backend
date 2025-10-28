/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppConfigModule } from './common/config/config.module';
import { AppLoggingInterceptor } from './common/interceptors/app-logger.interceptor';
import { AppLogger } from './common/logger/app-logger';
import { AgentflowModule } from './modules/agentflow/agentflow.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule, AgentflowModule],
  providers: [
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppLoggingInterceptor,
    },
  ],
})
export class AppModule {}
