import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CoreMessage } from 'ai';
import { azure } from '@ai-sdk/azure';
import { streamText } from 'ai';

@Injectable()
export class AiService {
  constructor() {}

  streamResponse(
    params: {
      messages: CoreMessage[];
      system: string;
      tools: any;
      maxSteps: number;
    },
    res: Response,
  ) {
    const result = streamText({
      model: azure('gpt-4o'),
      ...params,
      onFinish(event) { 
        console.log('Assistant: ', event.text);
      },
    });
    return result.pipeDataStreamToResponse(res);
  }

  extractDetails() {
    return 'extracted list of bank details';
  }
}
