/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class SimpleAuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3OC05MGFiLWNkZWYtMTIzNC01Njc4OTBhYmNkZWYiLCJyb2UiOiJVU0VSIiwiaWF0IjoxNjM5NTY4MDAwLCJleHAiOjE2Mzk2NTQ0MDB9.signature',
  })
  accessToken: string;
}
