/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Agent } from '@mastra/core/agent';

export const codeReviewAgent = new Agent({
  name: 'code-review-agent',
  id: 'code-review-agent',
  instructions: `You are an AI code review assistant. Your task is to:
1. Validate incoming webhook requests for security
2. Fetch pull request diffs from GitHub
3. Analyze code changes for potential issues, bugs, and improvements
4. Generate helpful, constructive review comments in Russian
5. Post review comments back to the GitHub pull request

Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance considerations
- Security vulnerabilities
- Maintainability and readability

Provide specific, actionable feedback with line numbers and file paths.`,
  model: {
    id: 'gemini/gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
  },
});

export type CodeReviewAgentType = typeof codeReviewAgent;
