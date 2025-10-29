/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { createTool } from '@mastra/core';

import {
  codeReviewWorkflowOutputSchema,
  PostCommentsInput,
  postCommentsInputSchema,
} from '../schemas';

export const postCommentsTool = createTool({
  id: 'post-comments',
  description: 'Post comments to a pull request',
  inputSchema: postCommentsInputSchema,
  outputSchema: codeReviewWorkflowOutputSchema,
  execute: async ({ context }: { context: PostCommentsInput }) => {
    const { comments, pull_request, repository } = context;

    if (!comments || comments.length === 0) {
      return {
        success: true,
        data: { posted: false, message: 'No comments to post' },
      };
    }

    const endpoint = `https://api.github.com/repos/${repository.owner.login}/${repository.name}/pulls/${pull_request.number}/reviews`;

    const reviewBody = {
      body: 'This is close to perfect! Please address the suggested inline change.',
      event: 'COMMENT',
      comments: comments.map((comment) => ({
        path: comment.path,
        body: comment.message,
        position: comment.line,
      })),
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${context.githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to post review: ${response.statusText} - ${errorBody}`);
    }

    const result = (await response.json()) as { id: string };

    return {
      success: true,
      data: { posted: true, reviewId: result.id },
    };
  },
});
