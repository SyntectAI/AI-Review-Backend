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

export const githubFileSchema = z.object({
  filename: z.string(),
  patch: z.string().nullable(),
});

export const githubFilesSchema = z.array(githubFileSchema);

export const changedLineSchema = z.object({
  content: z.string(),
  isAdded: z.boolean(),
  lineNumber: z.number(),
});

export const changedFileSchema = z.object({
  changes: z.array(changedLineSchema),
  filePath: z.string(),
  patch: z.string(),
});

export const codeReviewOutputSchema = z.object({
  data: z
    .object({
      files: z.array(changedFileSchema),
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
  files: z.array(changedFileSchema),
});

export const preparedCommentSchema = z.object({
  body: z.string(),
  path: z.string(),
  position: z.number(),
});

export const prepareCommentsOutputSchema = z.object({
  ...codeReviewWorkflowInputSchema.shape,
  comments: z.array(preparedCommentSchema),
  files: z.array(changedFileSchema),
});

export const postCommentsOutputSchema = z.object({
  data: z.object({
    posted: z.boolean(),
    reviewId: z.string(),
  }),
});

export type CodeReviewRequest = z.infer<typeof codeReviewWorkflowInputSchema>;

export type FetchPullRequestOutput = z.infer<typeof codeReviewOutputSchema>;

export type ChangedLine = z.infer<typeof changedLineSchema>;

export type GithubReviewComment = z.infer<typeof githubReviewCommentSchema>;

export type PostCommentsInput = z.infer<typeof postCommentsInputSchema>;

export type PreparedCommentsInput = z.infer<typeof prepareCommentsOutputSchema>;

export type CodeReviewResponse = z.infer<typeof codeReviewWorkflowOutputSchema>;
