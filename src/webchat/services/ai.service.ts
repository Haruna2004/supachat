import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CoreMessage, generateObject } from 'ai';
import { azure } from '@ai-sdk/azure';
import { streamText } from 'ai';
import {
  BULK_EXTRACT_SYSTEM_PROMPT,
  VALID_BANK_SYSTEM_PROMPT,
} from '../lib/prompt';
import { bulkDetailsSchema, validBankNameSchema } from '../lib/aitools';
import { BANK_LIST, BANK_NAMES } from '../lib/bankList';

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
      model: azure('gpt-4.1-mini'),
      ...params,
      onFinish(event) {
        console.log('Assistant: ', event.text);
      },
    });
    return result.pipeDataStreamToResponse(res);
  }

  async extractDetails(message: string) {
    const { object } = await generateObject({
      model: azure('gpt-4.1-mini'),
      prompt: message,
      system: BULK_EXTRACT_SYSTEM_PROMPT,
      schema: bulkDetailsSchema,
      output: 'array',
    });

    return object;
  }

  async getValidBankName(bankName: string) {
    const { object } = await generateObject({
      model: azure('gpt-4.1-mini'),
      prompt: `This is the complete list of valid banks names: ${BANK_NAMES} . This is the user inputed bankName: ${bankName} .`,
      system: VALID_BANK_SYSTEM_PROMPT,
      schema: validBankNameSchema,
    });

    return object;
  }
}
