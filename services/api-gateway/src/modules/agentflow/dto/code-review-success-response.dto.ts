/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class CodeReviewSuccessResponseDto {
  @ApiProperty({
    description: 'Indicates whether the code review workflow was successfully initiated',
    example: true,
  })
  success: boolean;
}
