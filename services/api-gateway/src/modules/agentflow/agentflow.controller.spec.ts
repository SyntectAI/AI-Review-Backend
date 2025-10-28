/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Test, TestingModule } from '@nestjs/testing';

import { AgentflowController } from './agentflow.controller';

describe('AgentflowController', () => {
  let controller: AgentflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentflowController],
    }).compile();

    controller = module.get<AgentflowController>(AgentflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
