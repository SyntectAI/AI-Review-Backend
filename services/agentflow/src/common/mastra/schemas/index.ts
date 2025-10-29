/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { z } from 'zod';

export const codeReviewWorkflowInputSchema = z.object({
  githubToken: z.string(),
  pull_request: z.object({
    diff_url: z.string(),
    html_url: z.string(),
    number: z.number(),
    title: z.string(),
  }),
  repository: z.object({
    name: z.string(),
    owner: z.object({ login: z.string() }),
  }),
});

export const codeReviewWorkflowOutputSchema = z.object({
  success: z.boolean(),
});

export const codeReviewOutputSchema = z.object({
  data: z
    .object({
      diff: z.string(),
    })
    .optional(),
});

export const analyzeCodeInputSchema = codeReviewOutputSchema;

export const githubReviewCommentSchema = z.object({
  line: z.number(),
  message: z.string(),
  path: z.string(),
});

export const analyzeCodeOutputSchema = z.array(githubReviewCommentSchema);

export const postCommentsInputSchema = z.object({
  ...codeReviewWorkflowInputSchema.shape,
  comments: analyzeCodeOutputSchema,
});

export const postCommentsOutputSchema = z.object({
  data: z.object({
    posted: z.boolean(),
    reviewId: z.string(),
  }),
});

export type CodeReviewRequest = z.infer<typeof codeReviewWorkflowInputSchema>;

export type GithubReviewComment = z.infer<typeof githubReviewCommentSchema>;

export type CodeReviewResponse = z.infer<typeof codeReviewWorkflowOutputSchema>;

export type PostCommentsInput = z.infer<typeof postCommentsInputSchema>;
