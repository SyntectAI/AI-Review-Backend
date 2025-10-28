/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Injectable, PipeTransform } from '@nestjs/common';

import { CodeReviewRequest } from '../interfaces';

@Injectable()
export class ReviewRequestValidationPipe implements PipeTransform {
  transform({
    pull_request: { diff_url, html_url, number, title },
    repository: {
      name,
      owner: { login },
    },
  }: CodeReviewRequest): CodeReviewRequest {
    return {
      pull_request: {
        diff_url,
        html_url,
        number,
        title,
      },
      repository: {
        name,
        owner: {
          login,
        },
      },
    };
  }
}
