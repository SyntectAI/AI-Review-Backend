/*
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createFetch, createSchema } from '@better-fetch/fetch';
import { createTool } from '@mastra/core';
import { z } from 'zod';

import {
  codeReviewWorkflowOutputSchema,
  PreparedCommentsInput,
  prepareCommentsOutputSchema,
} from '../schemas';

const $fetch = createFetch({
  baseURL: 'https://api.github.com',
  schema: createSchema({
    '@post/repos/:owner/:repo/pulls/:number/reviews': {
      output: z.object({
        id: z.number(),
      }),
      params: z.object({
        number: z.string(),
        owner: z.string(),
        repo: z.string(),
      }),
    },
  }),
});

export const postCommentsTool = createTool({
  description: 'Post comments to a pull request',
  execute: async ({ context }: { context: PreparedCommentsInput }) => {
    const {
      comments,
      pull_request: { number: pullRequestNumber },
      repository: {
        name: repositoryName,
        owner: { login: ownerLogin },
      },
    } = context;
    const { githubToken } = context;

    if (!comments?.length) {
      return {
        data: {
          message: 'No comments to post',
          posted: false,
        },
        success: true,
      };
    }

    const reviewBody = {
      body: 'This is close to perfect! Please address the suggested inline change.',
      comments,
      event: 'COMMENT',
    };

    const result = await $fetch('@post/repos/:owner/:repo/pulls/:number/reviews', {
      body: reviewBody,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubToken}`,
      },
      params: {
        number: pullRequestNumber.toString(),
        owner: ownerLogin,
        repo: repositoryName,
      },
    });

    if (result.error) {
      const { message, statusText } = result.error;
      const errorMessage = `Failed to post review: ${message} (${statusText}) - ${JSON.stringify(
        result.error,
      )}`;
      throw new Error(errorMessage);
    }

    return {
      data: {
        posted: true,
        reviewId: result.data.id,
      },
      success: true,
    };
  },
  id: 'post-comments',
  inputSchema: prepareCommentsOutputSchema,
  outputSchema: codeReviewWorkflowOutputSchema,
});
