/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

export interface CodeReviewRequest {
  githubToken: string;
  pull_request: {
    diff_url: string;
    html_url: string;
    number: number;
    title: string;
  };
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
}

export interface CodeReviewRequestPayload {
  githubToken: string;
  webhookPayload: string;
}

export interface CodeReviewResponse {
  success: boolean;
}

export interface GitHubComment {
  body: string;
  line: number;
  path: string;
}
