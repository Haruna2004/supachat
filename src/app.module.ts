import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppController } from './whatsapp/whatsapp.controller';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { ChatModule } from './chat/chat.module';
import { HelperModule } from './helper/helper.module';
import { WebchatModule } from './webchat/webchat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule, HelperModule, WebchatModule, AuthModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
})
export class AppModule {}
