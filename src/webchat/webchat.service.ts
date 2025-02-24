import { Injectable } from '@nestjs/common';
import { streamText } from 'ai';
import { azure } from '@ai-sdk/azure';
import { ClientMessage } from './webchat.types';
import { Response } from 'express';
import { toolDefs } from './ai/aitools';
import { PAY_SYSTEM_PROMPT } from './ai/prompt';

@Injectable()
export class WebchatService {
  process(clientMessage: ClientMessage, res: Response) {
    const lastMessage =
      clientMessage.messages[clientMessage.messages.length - 1];
    console.log('User: ', lastMessage.content);

    const result = streamText({
      model: azure('gpt-4o'),
      messages: clientMessage.messages,
      system: PAY_SYSTEM_PROMPT,
      tools: toolDefs,
      maxSteps: 5,
      onFinish(event) {
        console.log('Assistant: ', event.text);
      },
    });

    return result.pipeDataStreamToResponse(res);
  }
}
