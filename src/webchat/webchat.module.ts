import { Module } from '@nestjs/common';
import { WebchatService } from './webchat.service';
import { WebchatController } from './webchat.controller';
import { AiService } from './ai/ai.service';

@Module({
  controllers: [WebchatController],
  providers: [WebchatService, AiService],
})
export class WebchatModule {}
