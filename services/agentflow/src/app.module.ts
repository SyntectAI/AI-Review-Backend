/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppConfigModule } from './common/config/config.module';
import { GrpcLoggingInterceptor } from './common/interceptors/grpc-logging.interceptor';
import { AppLogger } from './common/logger/app-logger';
import { AgentFlowModule } from './modules/agentflow/agentflow.module';

@Module({
  imports: [AppConfigModule, AgentFlowModule],
  providers: [
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcLoggingInterceptor,
    },
  ],
})
export class AppModule {}
