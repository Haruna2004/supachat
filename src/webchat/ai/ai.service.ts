import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CoreMessage, generateObject } from 'ai';
import { azure } from '@ai-sdk/azure';
import { streamText } from 'ai';
import { BULK_EXTRACT_SYSTEM_PROMPT, VALID_BANK_SYSTEM_PROMPT } from './prompt';
import { bulkDetailsSchema, validBankNameSchema } from './aitools';
import { BANK_LIST, BANK_NAMES } from '../lib/bankList';
import { z } from 'zod';

@Injectable()
export class AiService {
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

  async extractDetails(message: string) {
    const { object } = await generateObject({
      model: azure('gpt-4o'),
      prompt: message,
      system: BULK_EXTRACT_SYSTEM_PROMPT,
      schema: bulkDetailsSchema,
      output: 'array',
    });

    return object;
  }

  async getValidBankName(bankName: string) {
    const { object } = await generateObject({
      model: azure('gpt-4o'),
      prompt: `This is the complete list of valid banks names: ${BANK_NAMES} . This is the user inputed bankName: ${bankName} .`,
      system: VALID_BANK_SYSTEM_PROMPT,
      schema: validBankNameSchema,
    });

    return object;
  }
}
