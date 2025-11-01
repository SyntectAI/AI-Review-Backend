/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AGENTFLOW_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'agentflow',
            protoPath: join(__dirname, '../../../../../proto/agentflow.proto'),
            url: configService.get<string>('AGENTFLOW_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AgentflowClientModule {}
