/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createStep } from '@mastra/core';
import { z } from 'zod';

import { mastra } from '../..';
import { CodeReviewAgentType } from '../../agents';
import { analyzeCodeInputSchema, analyzeCodeOutputSchema } from '../../schemas';

export const analyzeCodeStep = createStep({
  id: 'analyze-code-step',
  inputSchema: analyzeCodeInputSchema,
  outputSchema: analyzeCodeOutputSchema,
  execute: async ({ inputData, runtimeContext }) => {
    const agent = mastra.getAgent('codeReviewAgent') as CodeReviewAgentType;
    const result = await agent.generate(
      [
        {
          role: 'user',
          content: `Perform code review on the following diff: ${inputData.data?.diff}`,
        },
      ],
      {
        runtimeContext,
        structuredOutput: {
          schema: z.object({
            comments: analyzeCodeOutputSchema,
          }),
        },
      },
    );

    return result.object.comments;
  },
});
