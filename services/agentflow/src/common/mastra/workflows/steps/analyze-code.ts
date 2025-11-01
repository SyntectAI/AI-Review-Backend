/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createStep } from '@mastra/core';
import { z } from 'zod';

import { codeReviewAgent } from '../../agents';
import { formatChanges } from '../../lib';
import { analyzeCodeInputSchema, analyzeCodeOutputSchema } from '../../schemas';

export const analyzeCodeStep = createStep({
  execute: async ({ inputData, runtimeContext }) => {
    const formattedChanges = formatChanges(inputData.data?.files ?? []);

    if (!formattedChanges.trim()) {
      return [];
    }

    const result = await codeReviewAgent.generate(
      [
        {
          content: `Perform a code review on the following diff. Remember to only comment on lines starting with '+' and provide your response as a JSON object with a 'comments' key containing an array of comment objects (path, line, message).\n\nDiff:\n${formattedChanges}`,
          role: 'user',
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
  id: 'analyze-code-step',
  inputSchema: analyzeCodeInputSchema,
  outputSchema: analyzeCodeOutputSchema,
});
