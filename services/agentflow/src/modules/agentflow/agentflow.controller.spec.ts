/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Test, TestingModule } from '@nestjs/testing';

import { AgentFlowController } from './agentflow.controller';

describe('AuthController', () => {
  let controller: AgentFlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentFlowController],
    }).compile();

    controller = module.get<AgentFlowController>(AgentFlowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
