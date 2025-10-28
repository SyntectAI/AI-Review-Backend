/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { mastra } from '../../common/mastra';
import { CodeReviewRequest } from '../../common/types/workflow';
import { AgentFlowService } from './agentflow.service';

jest.mock('../../common/mastra', () => ({
  mastra: {
    getWorkflow: jest.fn(),
  },
}));

describe('AgentFlowService', () => {
  let service: AgentFlowService;

  const mockRun = {
    start: jest.fn().mockResolvedValue(undefined),
  };

  const mockWorkflow = {
    createRunAsync: jest.fn().mockResolvedValue(mockRun),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentFlowService],
    })
      .setLogger(new Logger())
      .compile();

    service = module.get<AgentFlowService>(AgentFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startCodeReview', () => {
    const codeReviewRequest: CodeReviewRequest = {
      pull_request: {
        diff_url: 'http://example.com/diff',
        html_url: 'http://example.com/pr',
        number: 1,
        title: 'Test PR',
      },
      repository: {
        name: 'test-repo',
        owner: {
          login: 'test-owner',
        },
      },
      githubToken: 'test-token',
    };

    it('should start code review workflow successfully', async () => {
      (mastra.getWorkflow as jest.Mock).mockReturnValue(mockWorkflow);

      const response = await service.startCodeReview(codeReviewRequest);

      expect(mastra.getWorkflow).toHaveBeenCalledWith('codeReviewWorkflow');
      expect(mockWorkflow.createRunAsync).toHaveBeenCalled();
      expect(mockRun.start).toHaveBeenCalledWith({ inputData: codeReviewRequest });
      expect(response).toEqual({ success: true });
    });

    it('should return success: false when workflow is not found', async () => {
      (mastra.getWorkflow as jest.Mock).mockReturnValue(undefined);
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      const response = await service.startCodeReview(codeReviewRequest);

      expect(mastra.getWorkflow).toHaveBeenCalledWith('codeReviewWorkflow');
      expect(mockWorkflow.createRunAsync).not.toHaveBeenCalled();
      expect(response).toEqual({ success: false });
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start Mastra workflow'),
        new Error('Code review workflow not found'),
      );
    });

    it('should return success: false when createRunAsync fails', async () => {
      const error = new Error('createRunAsync failed');
      (mastra.getWorkflow as jest.Mock).mockReturnValue({
        ...mockWorkflow,
        createRunAsync: jest.fn().mockRejectedValue(error),
      });
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      const response = await service.startCodeReview(codeReviewRequest);

      expect(response).toEqual({ success: false });
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start Mastra workflow'),
        error,
      );
    });

    it('should return success: true even when run.start fails due to current implementation', async () => {
      const error = new Error('run.start failed');
      (mastra.getWorkflow as jest.Mock).mockReturnValue({
        ...mockWorkflow,
        createRunAsync: jest.fn().mockResolvedValue({
          start: jest.fn().mockRejectedValue(error),
        }),
      });

      const response = await service.startCodeReview(codeReviewRequest);
      expect(response).toEqual({ success: true });
    });
  });
});
