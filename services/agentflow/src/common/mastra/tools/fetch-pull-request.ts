/*
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createTool } from '@mastra/core';

import { parsePatch } from '../lib';
import {
  codeReviewOutputSchema,
  CodeReviewRequest,
  codeReviewWorkflowInputSchema,
  githubFilesSchema,
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
    const filesUrl = `https://api.github.com/repos/${login}/${name}/pulls/${number}/files`;
    const response = await fetch(filesUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${githubToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch pull request files: ${response.statusText} - ${errorBody}`);
    }

    const body = (await response.json()) as unknown;
    const files = githubFilesSchema.parse(body);

    if (!files || files.length === 0) {
      return {
        success: false,
        error: new Error('No files found in the pull request'),
        shouldRetry: false,
      };
    }

    const changedFiles = files
      .map((file) => ({
        changes: parsePatch(file.patch),
        filePath: file.filename,
        patch: file.patch ?? '',
      }))
      .filter((file) => file.changes.length);

    return {
      success: true,
      data: {
        files: changedFiles,
      },
    };
  },
});
