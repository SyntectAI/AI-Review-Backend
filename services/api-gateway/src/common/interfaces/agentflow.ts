/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

import { CodeReviewRequestPayload } from './pull-request';

export interface AgentFlowService {
  startCodeReview(
    request: CodeReviewRequestPayload,
    metadata: Metadata,
  ): Observable<{ success: boolean }>;
}
