/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

@Injectable()
export class GithubSignatureGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { rawBody: Buffer }>();
    const signature = request.headers['x-hub-signature-256'] as string;

    if (!signature) {
      throw new UnauthorizedException('Missing signature');
    }

    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');

    if (!secret) {
      throw new UnauthorizedException('Webhook secret is not configured');
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(request.rawBody).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
