/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createStep } from '@mastra/core';
import { z } from 'zod';

import { mastra } from '../..';
import { CodeReviewAgentType } from '../../agents';
import { formatChanges } from '../../lib';
import { analyzeCodeInputSchema, analyzeCodeOutputSchema } from '../../schemas';

export const analyzeCodeStep = createStep({
  id: 'analyze-code-step',
  inputSchema: analyzeCodeInputSchema,
  outputSchema: analyzeCodeOutputSchema,
  execute: async ({ inputData, runtimeContext }) => {
    const formattedChanges = formatChanges(inputData.data?.files ?? []);

    if (!formattedChanges.trim()) {
      return [];
    }

    const agent = mastra.getAgent('codeReviewAgent') as CodeReviewAgentType;
    const result = await agent.generate(
      [
        {
          role: 'user',
          content: `Perform a code review on the following diff. Remember to only comment on lines starting with '+' and provide your response as a JSON object with a 'comments' key containing an array of comment objects (path, line, message).\n\nDiff:\n${formattedChanges}`,
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

    return result.object?.comments ?? [];
  },
});
