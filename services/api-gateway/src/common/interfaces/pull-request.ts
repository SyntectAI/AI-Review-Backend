/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
export interface CodeReviewPullRequest {
  diff_url: string;
  html_url: string;
  number: number;
  title: string;
}

export interface CodeReviewRepository {
  name: string;
  owner: {
    login: string;
  };
}

export interface CodeReviewRequest {
  pull_request: CodeReviewPullRequest;
  repository: CodeReviewRepository;
}

export interface CodeReviewRequestPayload {
  webhookPayload: string;
  githubToken: string;
}
