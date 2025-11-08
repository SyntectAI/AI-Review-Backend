/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AuthSwagger } from 'src/common/decorators/auth-swagger.decorator';
import { CustomRpcMetadata } from 'src/common/decorators/custom-rpc-metadata.decorator';
import { AuthService } from 'src/common/interfaces';

import { AuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('signin')
  @AuthSwagger.signIn()
  signIn(@Body() authDto: AuthDto, @CustomRpcMetadata() metadata: Metadata) {
    return this.authService.signIn(authDto, metadata);
  }
}
