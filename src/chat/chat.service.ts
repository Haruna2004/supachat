import { Injectable } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class ChatService {
  constructor(private readonly helperService: HelperService) {}

  async handleInput(userInput: string, sourceNum: string) {
    console.log(`${sourceNum} Message: `, userInput);
    await this.helperService.sendWhatsappTextMessage(
      sourceNum,
      'Hello Faruk, This is Chatpay',
    );
  }
}
