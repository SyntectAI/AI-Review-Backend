/*
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createFetch, createSchema } from '@better-fetch/fetch';
import { createTool } from '@mastra/core';
import { z } from 'zod';

import { parsePatch } from '../lib';
import {
  codeReviewOutputSchema,
  CodeReviewRequest,
  codeReviewWorkflowInputSchema,
  githubFilesSchema,
} from '../schemas';

const $fetch = createFetch({
  baseURL: 'https://api.github.com',
  schema: createSchema({
    '/repos/:owner/:repo/pulls/:number/files': {
      output: githubFilesSchema,
      params: z.object({
        number: z.string(),
        owner: z.string(),
        repo: z.string(),
      }),
    },
  }),
});

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
    const files = await $fetch('/repos/:owner/:repo/pulls/:number/files', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${githubToken}`,
      },
      params: {
        number: number.toString(),
        owner: login,
        repo: name,
      },
    });

    if (files.error) {
      const { message, statusText } = files.error;
      const errorMessage = `Failed to fetch pull request files: ${message} (${statusText}) - ${JSON.stringify(
        files.error,
      )}`;
      throw new Error(errorMessage);
    }

    if (!files.data?.length) {
      return {
        success: false,
        error: new Error('No files found in the pull request'),
        shouldRetry: false,
      };
    }

    const changedFiles = files.data
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
