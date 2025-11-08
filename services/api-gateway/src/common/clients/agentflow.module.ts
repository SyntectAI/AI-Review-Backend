/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/

import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  exports: [ClientsModule],
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'AGENTFLOW_SERVICE',
        useFactory: (configService: ConfigService) => ({
          options: {
            package: 'agentflow',
            protoPath: join('/app', 'proto', 'agentflow.proto'),
            url: configService.get<string>('AGENTFLOW_SERVICE_URL'),
          },
          transport: Transport.GRPC,
        }),
      },
    ]),
  ],
})
export class AgentflowClientModule {}
