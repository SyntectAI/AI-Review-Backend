/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CustomRpcMetadata = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Metadata => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const metadata = new Metadata();
    metadata.add('x-trace-id', (request.headers['x-trace-id'] || '') as string);

    return metadata;
  },
);
