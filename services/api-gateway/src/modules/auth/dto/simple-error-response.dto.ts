/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class SimpleErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-01-19T12:56:22.000Z',
  })
  timestamp: string;
}
