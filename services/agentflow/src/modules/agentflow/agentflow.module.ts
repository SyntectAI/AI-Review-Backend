/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';

import { AgentFlowController } from './agentflow.controller';
import { AgentFlowService } from './agentflow.service';

@Module({
  controllers: [AgentFlowController],
  providers: [AgentFlowService],
  exports: [AgentFlowService],
})
export class AgentFlowModule {}
