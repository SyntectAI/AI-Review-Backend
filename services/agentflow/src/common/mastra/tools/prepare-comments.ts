/*
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { createTool } from '@mastra/core';

import { getPositionFromLine } from '../lib';
import {
  PostCommentsInput,
  postCommentsInputSchema,
  prepareCommentsOutputSchema,
} from '../schemas';

export const prepareCommentsTool = createTool({
  id: 'prepare-comments-tool',
  description: 'Sorts, filters, and prepares comments for posting.',
  inputSchema: postCommentsInputSchema,
  outputSchema: prepareCommentsOutputSchema,
  execute: async ({ context }: { context: PostCommentsInput }) => {
    const { comments, files } = context;

    if (!comments?.length) {
      return { ...context, comments: [] };
    }

    const uniqueComments = comments
      .sort((a, b) => {
        if (a.path < b.path) return -1;
        if (a.path > b.path) return 1;

        return a.line - b.line;
      })
      .filter((comment, index, self) => {
        if (index === 0) return true;
        const prev = self[index - 1];

        return !(
          comment.path === prev.path &&
          comment.message === prev.message &&
          comment.line === prev.line + 1
        );
      });

    const preparedComments = uniqueComments
      .map((comment) => {
        const file = files.find(({ filePath }) => filePath === comment.path);

        if (!file) {
          return null;
        }

        return {
          body: comment.message,
          path: comment.path,
          position: getPositionFromLine(file.patch, comment.line),
        };
      })
      .filter(
        (comment): comment is { body: string; path: string; position: number } =>
          comment !== null && comment.position !== null,
      );

    const result = Promise.resolve({ ...context, comments: preparedComments });

    return result;
  },
});
