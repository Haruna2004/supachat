import { Injectable } from '@nestjs/common';
import { streamText } from 'ai';
import { ClientMessage } from './webchat.types';
import { Response } from 'express';
import { toolDefs } from './ai/aitools';
import { PAY_SYSTEM_PROMPT } from './ai/prompt';

import { createOpenAI } from '@ai-sdk/openai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
  compatibility: 'strict',
});

@Injectable()
export class WebchatService {
  process(clientMessage: ClientMessage, res: Response) {
    const lastMessage =
      clientMessage.messages[clientMessage.messages.length - 1];
    console.log('User: ', lastMessage.content);

    const result = streamText({
      model: groq.chat('llama-3.3-70b-versatile'),
      messages: clientMessage.messages,
      system: PAY_SYSTEM_PROMPT,
      tools: toolDefs,
      maxSteps: 10,
      onFinish(event) {
        console.log('Assistant: ', event.text);
      },
    });

    return result.pipeDataStreamToResponse(res);
  }
}
