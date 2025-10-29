/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createStep, Workflow } from '@mastra/core';

import { codeReviewWorkflowInputSchema, codeReviewWorkflowOutputSchema } from '../schemas';
import { fetchPullRequestTool, postCommentsTool } from '../tools';
import { analyzeCodeStep } from './steps';

export const codeReviewWorkflow = new Workflow({
  id: 'code-review-workflow',
  inputSchema: codeReviewWorkflowInputSchema,
  outputSchema: codeReviewWorkflowOutputSchema,
})
  .then(createStep(fetchPullRequestTool))
  .then(analyzeCodeStep)
  .map((mapApi) => {
    const mergedData = Promise.resolve({
      ...mapApi.getInitData<typeof codeReviewWorkflowInputSchema>(),
      comments: mapApi.inputData,
    });

    return mergedData;
  })
  .then(createStep(postCommentsTool))
  .commit();
