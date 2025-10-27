/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';

describe('AgentFlowService (e2e)', () => {
  let app: TestingModule;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture;
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
