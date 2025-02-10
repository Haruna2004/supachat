import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppController } from './whatsapp/whatsapp.controller';
import { WhatsAppService } from './whatsapp/whatsapp.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
})
export class AppModule {}
