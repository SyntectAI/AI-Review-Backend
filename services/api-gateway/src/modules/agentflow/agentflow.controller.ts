/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Inject,
  Logger,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CustomRpcMetadata } from 'src/common/decorators/custom-rpc-metadata.decorator';
import { GithubSignatureGuard } from 'src/common/guards/github-signature.guard';
import { type AgentFlowService, CodeReviewRequestPayload } from 'src/common/interfaces';
import { ReviewRequestValidationPipe } from 'src/common/pipes/review-request-mapper.pipe';

import { CodeReviewRequestDto } from './dto';

@ApiTags('agentflow')
@Controller('agentflow')
export class AgentflowController implements OnModuleInit {
  private readonly logger = new Logger(AgentflowController.name);

  private agentflowService: AgentFlowService;

  constructor(@Inject('AGENTFLOW_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.agentflowService = this.client.getService<AgentFlowService>('AgentFlowService');
  }

  @Post('review')
  @UseGuards(GithubSignatureGuard)
  startCodeReview(
    @Headers('X-GitHub-Event') githubEvent: string,
    @Body(new ReviewRequestValidationPipe()) body: CodeReviewRequestDto,
    @CustomRpcMetadata() metadata: Metadata,
  ) {
    if (githubEvent !== 'pull_request') {
      throw new BadRequestException('Event ignored: not a pull request event.');
    }

    if (!process.env.GITHUB_TOKEN) {
      throw new ForbiddenException('GitHub token is not set');
    }

    const request: CodeReviewRequestPayload = {
      githubToken: process.env.GITHUB_TOKEN,
      webhookPayload: JSON.stringify(body),
    };

    this.agentflowService.startCodeReview(request, metadata).subscribe({
      next: () => {
        this.logger.log('Successfully initiated code review workflow.');
      },
      error: (err) => {
        this.logger.error(`Error initiating code review workflow: ${err}`);
      },
    });

    return { success: true };
  }
}
