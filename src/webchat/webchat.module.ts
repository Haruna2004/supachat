import { Module } from '@nestjs/common';
import { WebchatController } from './webchat.controller';
import { WebchatService } from './services/webchat.service';
import { AiService } from './services/ai.service';
import { BulkService } from './services/bulk.service';
import { BrassService } from './services/brass.service';

@Module({
  controllers: [WebchatController],
  providers: [WebchatService, AiService, BulkService, BrassService],
})
export class WebchatModule {}
