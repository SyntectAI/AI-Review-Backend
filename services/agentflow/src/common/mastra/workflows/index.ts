/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createStep, Workflow } from '@mastra/core';

import {
  codeReviewWorkflowInputSchema,
  codeReviewWorkflowOutputSchema,
  FetchPullRequestOutput,
} from '../schemas';
import { fetchPullRequestTool, postCommentsTool, prepareCommentsTool } from '../tools';
import { analyzeCodeStep } from './steps';

export const codeReviewWorkflow = new Workflow({
  id: 'code-review-workflow',
  inputSchema: codeReviewWorkflowInputSchema,
  outputSchema: codeReviewWorkflowOutputSchema,
})
  .then(createStep(fetchPullRequestTool))
  .then(analyzeCodeStep)
  .map((mapApi) => {
    const fetchStepResult = mapApi.getStepResult('fetch-pull-request') as FetchPullRequestOutput;
    const result = Promise.resolve({
      ...mapApi.getInitData<typeof codeReviewWorkflowInputSchema>(),
      comments: mapApi.inputData,
      files: fetchStepResult.data?.files ?? [],
    });

    return result;
  })
  .then(createStep(prepareCommentsTool))
  .then(createStep(postCommentsTool))
  .commit();
