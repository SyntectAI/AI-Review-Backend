/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CodeReviewRequest } from 'src/common/mastra/schemas';
import { type CodeReviewRequestPayload } from 'src/common/types';

import { AgentFlowService } from './agentflow.service';

@Controller()
export class AgentFlowController {
  constructor(private readonly agentFlowService: AgentFlowService) {}

  @GrpcMethod('AgentFlowService', 'StartCodeReview')
  async startCodeReview(data: CodeReviewRequestPayload): Promise<{ success: boolean }> {
    return this.agentFlowService.startCodeReview({
      githubToken: data.githubToken,
      ...JSON.parse(data.webhookPayload),
    } as CodeReviewRequest);
  }
}
