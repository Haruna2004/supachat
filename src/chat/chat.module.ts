import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [HelperModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
