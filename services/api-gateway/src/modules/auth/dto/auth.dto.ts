/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'User login',
    example: 'user',
  })
  @IsString()
  @MinLength(5, { message: 'login must be longer than or equal to 5 characters' })
  login: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(5, { message: 'password must be longer than or equal to 5 characters' })
  password: string;
}
