import { Injectable } from '@nestjs/common';
import { GupshupMessagePayload } from './whatsapp.types';
import { ChatService } from 'src/chat/chat.service';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly chatService: ChatService,
    private readonly helperService: HelperService,
  ) {}
  // whatsapp webhook handler
  handleWebhook(payloadObj: GupshupMessagePayload) {
    const hookType = payloadObj.type;

    // if it's a user object, process it
    if (hookType === 'message')
      this.processMessage(payloadObj).catch((error) => {
        console.log('Error Processing message', payloadObj);
        console.error('Error: ', error);
      });

    return { status: 'ok' };
  }

  // process message from webhook
  async processMessage(payloadObj: GupshupMessagePayload) {
    const messageType = payloadObj.payload.type;
    const sourceNum = payloadObj.payload.source;

    if (messageType !== 'text') {
      const messageResText = 'Sorry. I can only accept text message';
      await this.helperService.sendWhatsappTextMessage(
        sourceNum,
        messageResText,
      );
      return;
    }

    const userMessage = payloadObj.payload.payload.text;
    await this.chatService.handleInput(userMessage, sourceNum);
  }
}
