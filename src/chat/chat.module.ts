import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { HelperModule } from 'src/helper/helper.module';
import { IntentService } from './core/intent.service';
import { AIService } from './libs/ai.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './core/payment.service';
import { VerifyService } from './core/verify.service';
import { BulkService } from './core/bulk.service';
import { BrassService } from './libs/brass.service';
import { DatabaseService } from './libs/db.service';

@Module({
  imports: [HelperModule, ConfigModule.forRoot()],
  providers: [
    ChatService,
    IntentService,
    AIService,
    PaymentService,
    VerifyService,
    BulkService,
    BrassService,
    DatabaseService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
