/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthDto, SimpleAuthResponseDto, SimpleErrorResponseDto } from '../../modules/auth/dto';

const AuthExamples = {
  body: {
    valid: {
      summary: 'Valid request',
      value: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
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
    invalidCredentials: {
      summary: 'Invalid credentials',
      value: {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
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
  responses: {
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
        id: '12345678-90ab-cdef-1234-567890abcdef',
        email: 'john.doe@example.com',
        role: 'USER',
        createdAt: '2025-01-19T12:54:39.000Z',
        updatedAt: '2025-01-19T12:54:39.000Z',
      },
    },
    validationErrors: {
      invalidEmail: {
        summary: 'Invalid email format',
        value: {
          statusCode: 400,
          message: 'Email must be a valid email address',
          timestamp: '2025-01-19T12:55:33.000Z',
        },
      },
      shortPassword: {
        summary: 'Password too short',
        value: {
          statusCode: 400,
          message: 'Password must be at least 8 characters long',
          timestamp: '2025-01-19T12:55:33.000Z',
        },
      },
    },
    invalidCredentials: {
      summary: 'Invalid email or password',
      value: {
        statusCode: 401,
        message: 'Invalid credentials',
        timestamp: '2025-01-19T12:56:22.000Z',
      },
    },
    existingUser: {
      summary: 'User with email already exists',
      value: {
        statusCode: 409,
        message: 'User with this email already exists',
        timestamp: '2025-01-19T12:55:33.000Z',
      },
    },
    invalidToken: {
      summary: 'Invalid token',
      value: {
        statusCode: 401,
        message: 'Invalid token',
        timestamp: '2025-01-19T12:56:47.000Z',
      },
    },
  },
};

export const AuthSwagger = {
  signUp: () => {
    const decorators = [
      ApiOperation({
        description:
          'Create a new user account with email and password. Returns a JWT access token upon successful registration.',
      }),
      ApiBody({
        description: 'User registration details',
        type: AuthDto,
        examples: {
          valid: AuthExamples.body.valid,
          invalidEmail: AuthExamples.body.invalidEmail,
          shortPassword: AuthExamples.body.shortPassword,
        },
      }),
      ApiResponse({
        status: 201,
        description: 'User successfully created and authenticated',
        type: SimpleAuthResponseDto,
        examples: { success: AuthExamples.responses.success },
      }),
      ApiResponse({
        status: 400,
        description: 'Validation error - Invalid input data',
        type: SimpleErrorResponseDto,
        examples: AuthExamples.responses.validationErrors,
      }),
      ApiResponse({
        status: 409,
        description: 'Conflict - User already exists',
        type: SimpleErrorResponseDto,
        examples: { existingUser: AuthExamples.responses.existingUser },
      }),
    ];
    return applyDecorators(...decorators);
  },

  signIn: () => {
    const decorators = [
      ApiOperation({
        description:
          'Authenticate user with email and password. Returns a JWT access token upon successful authentication.',
      }),
      ApiBody({
        description: 'User login credentials',
        type: AuthDto,
        examples: {
          validCredentials: AuthExamples.body.valid,
          invalidCredentials: AuthExamples.body.invalidCredentials,
        },
      }),
      ApiResponse({
        status: 200,
        description: 'User successfully authenticated',
        type: SimpleAuthResponseDto,
        examples: { success: AuthExamples.responses.success },
      }),
      ApiResponse({
        status: 400,
        description: 'Validation error - Invalid input data',
        type: SimpleErrorResponseDto,
        examples: {
          invalidEmail: AuthExamples.responses.validationErrors.invalidEmail,
        },
      }),
      ApiResponse({
        status: 401,
        description: 'Authentication error - Invalid credentials',
        type: SimpleErrorResponseDto,
        examples: { invalidCredentials: AuthExamples.responses.invalidCredentials },
      }),
    ];
    return applyDecorators(...decorators);
  },
};
