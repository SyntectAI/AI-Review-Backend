/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Mastra } from '@mastra/core';

import { codeReviewAgent } from './agents';
import { codeReviewWorkflow } from './workflows';

export const mastra = new Mastra({
  agents: {
    codeReviewAgent,
  },
  telemetry: {
    enabled: false,
  },
  workflows: {
    codeReviewWorkflow,
  },
});
