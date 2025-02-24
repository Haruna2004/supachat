import { tool } from 'ai';
import { BrassService } from 'src/chat/libs/brass.service';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';

const brassService = new BrassService(new ConfigService());

/* SCHEMAS */
const comAcctSchema = z.object({
  bankCode: z
    .string()
    .describe(
      'The numerical code identifying the bank, obtained after resolving the account name',
    ),
  accountNumber: z
    .number()
    .int()
    .min(1000000000)
    .max(9999999999)
    .describe('The 10-digit account number to be verified'),
});

const paySchema = z.object({
  title: z
    .string()
    .describe(
      'Generate a brief memo or description for the payment transaction',
    ),
  amount: z
    .number()
    .positive()
    .describe(
      'The payment amount in the local currency, extracted from user input',
    ),
  recipient: z.object({
    name: z
      .string()
      .describe(
        'The verified recipient name obtained after account confirmation',
      ),
    accountNumber: z
      .number()
      .int()
      .min(1000000000)
      .max(9999999999)
      .describe('The 10-digit verified account number'),
    bankId: z
      .string()
      .describe(
        'The unique bank identifier confirmed during account verification',
      ),
  }),
});

/* FUNCTIONS */
async function confirmAccount({
  bankCode,
  accountNumber,
}: z.infer<typeof comAcctSchema>) {
  const result = await brassService.confirmAccount(
    bankCode,
    accountNumber,
  );

  console.log('Account bankCode:', bankCode, 'Acct Number: ', accountNumber);

  if (!result.success)
    return {
      message: 'There was an error verifying bank details',
      details: result.error,
    };

  console.log(result);
  return result.data;
}

async function getBankCode({ detectedBank }: { detectedBank: string }) {
  const bankCode = brassService.getBankCode(detectedBank);
  console.log('Resolved Bank Code: ', bankCode, ' from ', detectedBank);
  if (!bankCode)
    return Promise.resolve(
      'Bank code for the bank name could not be determined, suggest some up to 5 potential nigerian bank they might be refering to',
    );
  return Promise.resolve(bankCode);
}

async function processPayment({
  title,
  amount,
  recipient,
}: z.infer<typeof paySchema>) {
  console.log('Payment was processed', title, amount);
  return Promise.resolve(
    `Payment of ${amount} has been sent to ${recipient.name} successfully`,
  );
}

/* TOOL */
export const toolDefs = {
  confirmAccount: tool({
    description:
      'Verify and validate bank account details, returning confirmed account information',
    parameters: comAcctSchema,
    execute: confirmAccount,
  }),

  getBankCode: tool({
    description:
      'Lookup and retrieve the numerical bank code when given a bank name',
    parameters: z.object({
      detectedBank: z
        .string()
        .describe(
          'The bank name detected from user conversation that needs to be resolved to a code',
        ),
    }),
    execute: getBankCode,
  }),

  processPayment: tool({
    description:
      'Execute the payment transaction after explicit user approval has been received',
    parameters: paySchema,
    execute: processPayment,
  }),
};
