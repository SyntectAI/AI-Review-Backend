/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Observable } from 'rxjs';

import { CodeReviewRequestPayload } from './pull-request';

export interface AgentFlowService {
  startCodeReview(request: CodeReviewRequestPayload): Observable<{ success: boolean }>;
}
