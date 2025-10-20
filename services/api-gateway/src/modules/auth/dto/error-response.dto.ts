/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message describing what went wrong',
    example: 'User with this email already exists',
  })
  message: string;

  @ApiProperty({
    description: 'Error code for programmatic handling',
    example: 'USER_ALREADY_EXISTS',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Additional error details',
    example: { field: 'email', value: 'user@example.com' },
    required: false,
  })
  details?: any;
}

export class ValidationErrorDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Array of validation errors',
    example: [
      {
        field: 'email',
        message: 'Email must be a valid email address',
      },
      {
        field: 'password',
        message: 'Password must be at least 8 characters long',
      },
    ],
  })
  errors: Array<{
    field: string;
    message: string;
  }>;
}
