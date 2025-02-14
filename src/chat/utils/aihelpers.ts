import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const intent = z.object({
  intention: z.enum([
    'Initiate_Payment',
    'Initiate_Bulk_Payment',
    'Initiate_Verify_Payment',
    'Could_Not_Detect',
  ]),
});

export const payDetailsPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'As a payment details extractor to accurately get a payment detail from natural text.',
  ],
  [
    'developer',
    'Given an input text get payment details from it. UserInput: {userInput}',
  ],
]);

export const payDetailsObj = z.object({
  recipient: z.string().optional().describe('Receiver like name in input text'),
  title: z.string().describe('Generate a short title for the transcation'),
  amount: z
    .number()
    .describe('an amount given. if you cannot determine return -1'),
  accountNumber: z
    .number()
    .describe('10 digit account number. if digit is not exactly 10 return -1'),
  bankName: z
    .string()
    .describe(
      'Detected Bank name in text. Correct if need to match a known Bank else return an empty string if you could not detect',
    ),
});
