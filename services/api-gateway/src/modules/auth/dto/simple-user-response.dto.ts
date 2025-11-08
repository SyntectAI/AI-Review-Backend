/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';

export class SimpleUserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '12345678-90ab-cdef-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'user',
  })
  login: string;

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
