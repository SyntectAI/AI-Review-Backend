/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createTool } from '@mastra/core';

import {
  codeReviewOutputSchema,
  CodeReviewRequest,
  codeReviewWorkflowInputSchema,
} from '../schemas';

export const fetchPullRequestTool = createTool({
  id: 'fetch-pull-request',
  description: 'Fetch a pull request from GitHub',
  inputSchema: codeReviewWorkflowInputSchema,
  outputSchema: codeReviewOutputSchema,
  execute: async ({
    context: {
      githubToken,
      pull_request: { number },
      repository: {
        name,
        owner: { login },
      },
    },
  }: {
    context: CodeReviewRequest;
  }) => {
    const diffUrl = `https://api.github.com/repos/${login}/${name}/pulls/${number}`;

    const response = await fetch(diffUrl, {
      headers: {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: `Bearer ${githubToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch diff: ${response.statusText} - ${errorBody}`);
    }

    const diff = await response.text();

    if (!diff || !diff.trim()) {
      return {
        success: false,
        error: new Error('Diff file is empty'),
        shouldRetry: false,
      };
    }

    return {
      success: true,
      data: { diff },
    };
  },
});
