/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthClientModule } from 'src/common/clients/auth-client.module';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [AuthClientModule, PassportModule],
  controllers: [AuthController],
  providers: [
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) => new JwtStrategy(configService),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
