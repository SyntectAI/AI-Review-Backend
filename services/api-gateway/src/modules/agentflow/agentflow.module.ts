/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AgentflowClientModule } from 'src/common/clients/agentflow.module';

import { AgentflowController } from './agentflow.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AgentflowController],
  imports: [AgentflowClientModule, PassportModule],
  providers: [
    {
      inject: [ConfigService],
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) => new JwtStrategy(configService),
    },
  ],
})
export class AgentflowModule {}
