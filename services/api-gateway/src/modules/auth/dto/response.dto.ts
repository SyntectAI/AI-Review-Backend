/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3OC05MGFiLWNkZWYtMTIzNC01Njc4OTBhYmNkZWYiLCJyb2UiOiJVU0VSIiwiaWF0IjoxNjM5NTY4MDAwLCJleHAiOjE2Mzk2NTQ0MDB9.signature',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 864000,
    default: 864000,
  })
  expiresIn: number;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '12345678-90ab-cdef-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: ['ADMIN', 'USER'],
    example: 'USER',
  })
  role: 'ADMIN' | 'USER';

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2025-01-19T12:54:39.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-19T12:54:39.000Z',
  })
  updatedAt: string;
}

export class ValidateTokenResponseDto extends UserResponseDto {
  @ApiProperty({
    description: 'Token validation status',
    example: true,
  })
  valid: boolean;
}
