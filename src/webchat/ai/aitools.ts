import { tool } from 'ai';
import { z } from 'zod';
import { BrassService } from '../wcbrass.service';
import { BrassPayable } from '../webchat.types';
import { randomUUID } from 'crypto';

const brassService = new BrassService();

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
});

export function createTools(brassToken?: string, brassAccountId?: string) {
  /* FUNCTIONS */

  async function confirmAccount({
    bankCode,
    accountNumber,
  }: z.infer<typeof comAcctSchema>) {
    const result = await brassService.confirmAccount(
      bankCode,
      accountNumber,
      brassToken,
    );
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

  async function processPayment(args: z.infer<typeof paySchema>) {
    const brassPayable: BrassPayable = {
      customer_reference: randomUUID(),
      amount: args.amount * 100,
      title: `Concierge-${args.title}`,
      source_account: brassAccountId ?? '',
      to: {
        account_number: args.accountNumber.toString(),
        bank: args.bankId,
        name: args.name,
      },
    };

    console.log('payment request', brassPayable);

    const result = await brassService.createPayment(brassPayable, brassToken);

    if (!result.success) {
      return Promise.resolve(`Payment was not successfully`);
    }

    return Promise.resolve(
      `Payment of ${args.amount} to ${args.name} created successfully`,
    );
  }

  /* TOOL DEFS */
  return {
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
}
