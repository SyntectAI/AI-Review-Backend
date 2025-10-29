/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CodeReviewRequest, CodeReviewResponse } from 'src/common/mastra/schemas';

import { mastra } from '../../common/mastra';

@Injectable()
export class AgentFlowService {
  private readonly logger = new Logger(AgentFlowService.name);

  async startCodeReview(inputData: CodeReviewRequest): Promise<CodeReviewResponse> {
    const workflowId = randomUUID();

    this.logger.log(`Starting Mastra code review workflow: ${workflowId}`);

    try {
      const workflow = mastra.getWorkflow('codeReviewWorkflow');

      if (!workflow) {
        throw new Error('Code review workflow not found');
      }

      const run = await workflow.createRunAsync();

      return run
        .start({
          inputData,
        })
        .then(() => ({ success: true }))
        .catch((error) => {
          this.logger.error(`Failed to start Mastra workflow ${workflowId}:`, error);

          return {
            success: false,
          };
        });
    } catch (error) {
      this.logger.error(`Failed to start Mastra workflow ${workflowId}:`, error);

      return {
        success: false,
      };
    }
  }
}
