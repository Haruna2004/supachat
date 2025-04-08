import { Module } from '@nestjs/common';
import { WebchatService } from './webchat.service';
import { WebchatController } from './webchat.controller';
import { AiService } from './ai/ai.service';
import { BulkService } from './bulk.service';
import { BrassService } from './brass.service';

@Module({
  controllers: [WebchatController],
  providers: [WebchatService, AiService, BulkService, BrassService],
})
export class WebchatModule {}
