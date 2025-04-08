import { Injectable } from '@nestjs/common';
import { BulkClientMessage, ClientMessage } from './webchat.types';
import { Response } from 'express';
import { PAY_SYSTEM_PROMPT } from './ai/prompt';
import { createTools } from './ai/aitools';
import { AiService } from './ai/ai.service';
import { BulkService } from './bulk.service';

@Injectable()
export class WebchatService {
  constructor(
    private readonly aiService: AiService,
    private readonly bulkService: BulkService,
  ) {}

  process(clientMessage: ClientMessage, res: Response) {
    const lastMessage =
      clientMessage.messages[clientMessage.messages.length - 1];
    console.log('User: ', lastMessage.content);

    return this.aiService.streamResponse(
      {
        messages: clientMessage.messages,
        system: PAY_SYSTEM_PROMPT,
        tools: createTools(
          clientMessage.brassToken,
          clientMessage.brassAccountId,
        ),
        maxSteps: 10,
      },
      res,
    );
  }

  async processBulk(bulkPayBody: BulkClientMessage) {
    console.log(bulkPayBody.message);
    return await this.bulkService.handleBulk(bulkPayBody);
  }
}
