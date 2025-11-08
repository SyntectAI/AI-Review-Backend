/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthDto, SimpleAuthResponseDto, SimpleErrorResponseDto } from '../../modules/auth/dto';

const AuthExamples = {
  body: {
    invalidCredentials: {
      summary: 'Invalid credentials',
      value: {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      },
    },
    invalidEmail: {
      summary: 'Invalid email format',
      value: {
        email: 'invalid-email',
        password: 'SecurePass123!',
      },
    },
    shortPassword: {
      summary: 'Password too short',
      value: {
        email: 'john.doe@example.com',
        password: '123',
      },
    },
    valid: {
      summary: 'Valid request',
      value: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      },
    },
  },
  responses: {
    existingUser: {
      summary: 'User with email already exists',
      value: {
        message: 'User with this email already exists',
        statusCode: 409,
        timestamp: '2025-01-19T12:55:33.000Z',
      },
    },
    invalidCredentials: {
      summary: 'Invalid email or password',
      value: {
        message: 'Invalid credentials',
        statusCode: 401,
        timestamp: '2025-01-19T12:56:22.000Z',
      },
    },
    invalidToken: {
      summary: 'Invalid token',
      value: {
        message: 'Invalid token',
        statusCode: 401,
        timestamp: '2025-01-19T12:56:47.000Z',
      },
    },
    success: {
      summary: 'Successful operation',
      value: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDU2NzgtOTBhYi1jZGVmLTEyMzQtNTY3ODkwYWJjZGVmIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2Mzk1NjgwMDAsImV4cCI6MTYzOTY1NDQwMH0.signature',
      },
    },
    userResponse: {
      summary: 'Valid token response',
      value: {
        createdAt: '2025-01-19T12:54:39.000Z',
        email: 'john.doe@example.com',
        id: '12345678-90ab-cdef-1234-567890abcdef',
        role: 'USER',
        updatedAt: '2025-01-19T12:54:39.000Z',
      },
    },
    validationErrors: {
      invalidEmail: {
        summary: 'Invalid email format',
        value: {
          message: 'Email must be a valid email address',
          statusCode: 400,
          timestamp: '2025-01-19T12:55:33.000Z',
        },
      },
      shortPassword: {
        summary: 'Password too short',
        value: {
          message: 'Password must be at least 8 characters long',
          statusCode: 400,
          timestamp: '2025-01-19T12:55:33.000Z',
        },
      },
    },
  },
  tokenBody: {
    validToken: {
      summary: 'Valid token for validation',
      value: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDU2NzgtOTBhYi1jZGVmLTEyMzQtNTY3ODkwYWJjZGVmIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2Mzk1NjgwMDAsImV4cCI6MTYzOTY1NDQwMH0.signature',
      },
    },
  },
};

export const AuthSwagger = {
  signIn: () => {
    const decorators = [
      ApiOperation({
        description:
          'Authenticate user with email and password. Returns a JWT access token upon successful authentication.',
      }),
      ApiBody({
        description: 'User login credentials',
        examples: {
          invalidCredentials: AuthExamples.body.invalidCredentials,
          validCredentials: AuthExamples.body.valid,
        },
        type: AuthDto,
      }),
      ApiResponse({
        description: 'User successfully authenticated',
        examples: { success: AuthExamples.responses.success },
        status: 200,
        type: SimpleAuthResponseDto,
      }),
      ApiResponse({
        description: 'Validation error - Invalid input data',
        examples: {
          invalidEmail: AuthExamples.responses.validationErrors.invalidEmail,
        },
        status: 400,
        type: SimpleErrorResponseDto,
      }),
      ApiResponse({
        description: 'Authentication error - Invalid credentials',
        examples: { invalidCredentials: AuthExamples.responses.invalidCredentials },
        status: 401,
        type: SimpleErrorResponseDto,
      }),
    ];
    return applyDecorators(...decorators);
  },
  signUp: () => {
    const decorators = [
      ApiOperation({
        description:
          'Create a new user account with email and password. Returns a JWT access token upon successful registration.',
      }),
      ApiBody({
        description: 'User registration details',
        examples: {
          invalidEmail: AuthExamples.body.invalidEmail,
          shortPassword: AuthExamples.body.shortPassword,
          valid: AuthExamples.body.valid,
        },
        type: AuthDto,
      }),
      ApiResponse({
        description: 'User successfully created and authenticated',
        examples: { success: AuthExamples.responses.success },
        status: 201,
        type: SimpleAuthResponseDto,
      }),
      ApiResponse({
        description: 'Validation error - Invalid input data',
        examples: AuthExamples.responses.validationErrors,
        status: 400,
        type: SimpleErrorResponseDto,
      }),
      ApiResponse({
        description: 'Conflict - User already exists',
        examples: { existingUser: AuthExamples.responses.existingUser },
        status: 409,
        type: SimpleErrorResponseDto,
      }),
    ];
    return applyDecorators(...decorators);
  },
};
