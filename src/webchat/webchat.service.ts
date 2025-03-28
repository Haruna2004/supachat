import { Injectable } from '@nestjs/common';
// import { streamText } from 'ai';
import { ClientMessage } from './webchat.types';
import { Response } from 'express';
import { PAY_SYSTEM_PROMPT } from './ai/prompt';
// import { azure } from '@ai-sdk/azure';
import { createTools } from './ai/aitools';
import { AiService } from './ai/ai.service';


@Injectable()
export class WebchatService {
  constructor(private readonly aiService: AiService) {}

  process(clientMessage: ClientMessage, res: Response) {
    const lastMessage =
      clientMessage.messages[clientMessage.messages.length - 1];
    console.log('User: ', lastMessage.content); 

    return this.aiService.streamResponse({
      messages: clientMessage.messages,
      system: PAY_SYSTEM_PROMPT,
      tools: createTools(
        clientMessage.brassToken,
        clientMessage.brassAccountId,
      ),
      maxSteps: 10,
    }, res)
  }

  processBulk(message: string) {
    console.log(message)
    return Response.json({ message: 'Handle Bulk Logic' })
  }

}
