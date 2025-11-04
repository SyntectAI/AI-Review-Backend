/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CodeReviewRequestDto, CodeReviewSuccessResponseDto } from '../../modules/agentflow/dto';
import { SimpleErrorResponseDto } from '../../modules/auth/dto';

const CodeReviewExamples = {
  body: {
    closed: {
      summary: 'Pull request closed action (will be ignored)',
      value: {
        action: 'closed',
        pull_request: {
          diff_url: 'https://github.com/owner/repo/pull/123.diff',
          html_url: 'https://github.com/owner/repo/pull/123',
          number: 123,
          title: 'Fix authentication bug',
        },
        repository: {
          name: 'repo',
          owner: {
            login: 'owner',
          },
        },
      },
    },
    opened: {
      summary: 'Valid pull request webhook payload with opened action',
      value: {
        action: 'opened',
        pull_request: {
          diff_url: 'https://github.com/owner/repo/pull/123.diff',
          html_url: 'https://github.com/owner/repo/pull/123',
          number: 123,
          title: 'Fix authentication bug',
        },
        repository: {
          name: 'repo',
          owner: {
            login: 'owner',
          },
        },
      },
    },
    reopened: {
      summary: 'Pull request reopened action (will be ignored)',
      value: {
        action: 'reopened',
        pull_request: {
          diff_url: 'https://github.com/owner/repo/pull/123.diff',
          html_url: 'https://github.com/owner/repo/pull/123',
          number: 123,
          title: 'Fix authentication bug',
        },
        repository: {
          name: 'repo',
          owner: {
            login: 'owner',
          },
        },
      },
    },
  },
  responses: {
    ignored: {
      summary: 'Event ignored - action is not "opened"',
      value: {
        success: false,
      },
    },
    invalidEvent: {
      summary: 'Event type is not pull_request',
      value: {
        message: 'Event ignored: not a pull request event.',
        statusCode: 400,
        timestamp: '2025-01-19T12:55:33.000Z',
      },
    },
    invalidSignature: {
      summary: 'Invalid signature',
      value: {
        message: 'Invalid signature',
        statusCode: 401,
        timestamp: '2025-01-19T12:56:22.000Z',
      },
    },
    missingSignature: {
      summary: 'Missing signature header',
      value: {
        message: 'Missing signature',
        statusCode: 401,
        timestamp: '2025-01-19T12:56:22.000Z',
      },
    },
    missingToken: {
      summary: 'GitHub token not configured',
      value: {
        message: 'GitHub token is not set',
        statusCode: 403,
        timestamp: '2025-01-19T12:56:22.000Z',
      },
    },
    success: {
      summary: 'Successful initiation - workflow started',
      value: {
        success: true,
      },
    },
    validationError: {
      summary: 'Validation error',
      value: {
        message: 'Validation failed',
        statusCode: 400,
        timestamp: '2025-01-19T12:55:33.000Z',
      },
    },
  },
};

export const AgentflowSwagger = {
  startCodeReview: () => {
    const decorators = [
      ApiOperation({
        description:
          'Initiates a code review workflow for a GitHub pull request. Requires GitHub webhook signature verification, pull_request event type, and action must be "opened". Events with other actions (reopened, closed) will be ignored and return success: false.',
      }),
      ApiHeader({
        description: 'GitHub webhook event type. Must be "pull_request" for this endpoint.',
        name: 'X-GitHub-Event',
        required: true,
      }),
      ApiHeader({
        description: 'GitHub webhook signature for authentication (SHA-256 HMAC).',
        name: 'X-Hub-Signature-256',
        required: true,
      }),
      ApiBody({
        description:
          'GitHub webhook payload containing pull request and repository information. Only events with action="opened" will trigger the code review workflow.',
        examples: {
          closed: CodeReviewExamples.body.closed,
          opened: CodeReviewExamples.body.opened,
          reopened: CodeReviewExamples.body.reopened,
        },
        type: CodeReviewRequestDto,
      }),
      ApiResponse({
        description:
          'Request processed successfully. Returns success: true if workflow was initiated (action="opened"), or success: false if event was ignored (other actions).',
        examples: {
          ignored: CodeReviewExamples.responses.ignored,
          success: CodeReviewExamples.responses.success,
        },
        status: 200,
        type: CodeReviewSuccessResponseDto,
      }),
      ApiResponse({
        description: 'Bad request - Invalid event type or validation error',
        examples: {
          invalidEvent: CodeReviewExamples.responses.invalidEvent,
          validationError: CodeReviewExamples.responses.validationError,
        },
        status: 400,
        type: SimpleErrorResponseDto,
      }),
      ApiResponse({
        description: 'Unauthorized - Missing or invalid GitHub webhook signature',
        examples: {
          invalidSignature: CodeReviewExamples.responses.invalidSignature,
          missingSignature: CodeReviewExamples.responses.missingSignature,
        },
        status: 401,
        type: SimpleErrorResponseDto,
      }),
      ApiResponse({
        description: 'Forbidden - GitHub token is not configured',
        examples: {
          missingToken: CodeReviewExamples.responses.missingToken,
        },
        status: 403,
        type: SimpleErrorResponseDto,
      }),
    ];
    return applyDecorators(...decorators);
  },
};
