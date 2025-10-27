import { Test, TestingModule } from '@nestjs/testing';

import { AgentFlowController } from './modules/agentflow/agentflow.controller';

describe('AgentFlowController', () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AgentFlowController],
    }).compile();

    app.get<AgentFlowController>(AgentFlowController);
  });
});
