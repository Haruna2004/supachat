import { tool } from 'ai';
import { z } from 'zod';
import { BrassService } from '../services/brass.service';
import { BrassPayable } from '../webchat.types';
import { randomUUID } from 'crypto';
import { BANK_LIST } from './bankList';
import { AiService } from '../services/ai.service';

const brassService = new BrassService();
const aiService = new AiService();

/* SCHEMAS */
const singleComAcctSchema = z.object({
  bankCode: z.string().describe('The numerical code identifying the bank.'),
  accountNumber: z.string().describe('The 10-digit account number.'),
});

const singlePaySchema = z.object({
  title: z
    .string()
    .describe('A brief memo/description for the payment transaction.'),
  amount: z
    .number()
    .positive()
    .describe('The payment amount in the base currency unit.'),
  name: z.string().describe('The verified recipient name.'),
  accountNumber: z
    .string()
    .length(10)
    .regex(/^\d{10}$/)
    .describe('The 10-digit verified account number.'),
  bankId: z
    .string()
    .describe('The unique bank identifier (usually same as bank code).'),
  // Add an optional identifier if needed to map results back to original input
  _inputIndex: z
    .number()
    .optional()
    .describe('Internal index to track original request'),
});

const bulkConfirmAcctSchema = z.object({
  accountsToConfirm: z
    .array(singleComAcctSchema)
    .describe('List of accounts (bank code and number) to verify.'),
});

const bulkBankCodeSchema = z.object({
  detectedBanks: z
    .array(z.string())
    .describe('List of bank names detected from user conversation.'),
});

const bulkPaySchema = z.object({
  paymentsToProcess: z
    .array(singlePaySchema)
    .describe('List of payments to execute after user approval.'),
});

export function createTools(brassToken?: string, brassAccountId?: string) {
  /* FUNCTIONS */

  async function confirmMultipleAccounts({
    accountsToConfirm,
  }: z.infer<typeof bulkConfirmAcctSchema>) {
    console.log('Attempting to confirm accounts:', accountsToConfirm);
    const results = await Promise.allSettled(
      accountsToConfirm.map((account) =>
        brassService.confirmAccount(
          account.bankCode,
          account.accountNumber,
          brassToken,
        ),
      ),
    );

    return results.map((result, index) => {
      const inputAccount = accountsToConfirm[index];
      if (result.status === 'fulfilled') {
        const apiResult = result.value;
        if (apiResult.success) {
          console.log(
            `Confirmation Success for ${inputAccount.accountNumber}:`,
            apiResult.data,
          );
          return {
            input: inputAccount,
            status: 'success' as const, // Explicitly type as literal
            data: apiResult.data, // { account_name: string, bank_id: string, account_number: string }
          };
        } else {
          console.log(
            `Confirmation Failed for ${inputAccount.accountNumber}:`,
            apiResult.error,
          );
          return {
            input: inputAccount,
            status: 'error' as const,
            error: apiResult.error, // { code: string, message: string }
          };
        }
      } else {
        // Promise rejected (network error, timeout, etc.)
        console.error(
          `Confirmation System Error for ${inputAccount.accountNumber}:`,
          result.reason,
        );
        return {
          input: inputAccount,
          status: 'error' as const,
          error: {
            code: 'TOOL_EXECUTION_ERROR',
            message:
              'Failed to communicate with the account confirmation service.',
          },
        };
      }
    });
  }

  async function getMultipleBankCodes({
    detectedBanks,
  }: z.infer<typeof bulkBankCodeSchema>) {
    console.log('Attempting to resolve bank codes for:', detectedBanks);
    const results = await Promise.allSettled(
      detectedBanks.map(async (bankName) => {
        if (!bankName || bankName.trim() === '') {
          return {
            detectedBank: bankName,
            status: 'error' as const,
            error: 'No bank name provided.',
          };
        }
        // Use AI service first if it does fuzzy matching/validation
        const validationResult = await aiService.getValidBankName(bankName);
        if (validationResult.error || !validationResult.validBankName) {
          console.log(
            `Bank name validation failed for ${bankName}:`,
            validationResult.error,
          );
          return {
            detectedBank: bankName,
            status: 'error' as const,
            error:
              validationResult.error ??
              'Could not determine a valid bank name.',
          };
        }

        const validName = validationResult.validBankName;
        const bankCode = BANK_LIST[validName]; // Assuming BANK_LIST maps valid name to code

        if (!bankCode) {
          console.log(
            `Bank code not found for valid name ${validName} (from ${bankName})`,
          );
          return {
            detectedBank: bankName,
            status: 'error' as const,
            error: `Could not find a bank code for '${validName}'.`,
          };
        }

        console.log(
          `Resolved Bank Code for ${bankName} (as ${validName}): ${bankCode}`,
        );
        return {
          detectedBank: bankName,
          validBankName: validName,
          status: 'success' as const,
          bankCode: bankCode,
        };
      }),
    );

    return results.map((result, index) => {
      const inputBank = detectedBanks[index];
      if (result.status === 'fulfilled') {
        return result.value; // Contains { detectedBank, status, bankCode?, error? }
      } else {
        console.error(
          `Bank code resolution System Error for ${inputBank}:`,
          result.reason,
        );
        return {
          detectedBank: inputBank,
          status: 'error' as const,
          error: 'Failed to process bank name resolution request.',
        };
      }
    });
  }

  async function processMultiplePayments({
    paymentsToProcess,
  }: z.infer<typeof bulkPaySchema>) {
    console.log('Attempting to process payments:', paymentsToProcess);

    const sourceAccount = brassAccountId ?? '';
    if (!sourceAccount) {
      console.error('Source Account ID is missing, cannot process payments.');
      return paymentsToProcess.map((p) => ({
        input: p,
        status: 'error' as const,
        message: 'Configuration error: Source account ID is missing.',
      }));
    }

    const results = await Promise.allSettled(
      paymentsToProcess.map((payment) => {
        const payable: BrassPayable = {
          customer_reference: randomUUID(),
          amount: payment.amount * 100, // Convert to Kobo/Cents
          title: `Concierge-${payment.title}`,
          source_account: sourceAccount,
          to: {
            account_number: payment.accountNumber,
            bank: payment.bankId, // Should be the ID from confirmation
            name: payment.name,
          },
        };
        console.log('Creating payment request:', payable);
        return brassService.createPayment(payable, brassToken);
      }),
    );

    return results.map((result, index) => {
      const inputPayment = paymentsToProcess[index];
      if (result.status === 'fulfilled') {
        const apiResult = result.value;
        if (apiResult.success) {
          console.log(`Payment Success for ${inputPayment.accountNumber}`);
          return {
            input: inputPayment,
            status: 'success' as const,
            message: `Payment of ${inputPayment.amount} to ${inputPayment.name} (${inputPayment.accountNumber}) initiated successfully.`, // Or use message from API if available
          };
        } else {
          console.log(
            `Payment Failed for ${inputPayment.accountNumber}:`,
            apiResult.message,
          );
          return {
            input: inputPayment,
            status: 'error' as const,
            message: apiResult.message ?? 'Payment processing failed.', // Use error message from API
          };
        }
      } else {
        console.error(
          `Payment System Error for ${inputPayment.accountNumber}:`,
          result.reason,
        );
        return {
          input: inputPayment,
          status: 'error' as const,
          message: 'Failed to communicate with the payment processing service.',
        };
      }
    });
  }

  return {
    confirmAccount: tool({
      description:
        'Verify and validate a list of bank account details, returning confirmed information or errors for each.',
      parameters: bulkConfirmAcctSchema, // Use bulk schema
      execute: confirmMultipleAccounts, // Use bulk execution logic
    }),

    getBankCode: tool({
      description:
        'Lookup and retrieve numerical bank codes for a list of bank names.',
      parameters: bulkBankCodeSchema, // Use bulk schema
      execute: getMultipleBankCodes, // Use bulk execution logic
    }),

    processPayment: tool({
      description:
        'Execute a list of payment transactions after explicit user approval for the batch has been received.',
      parameters: bulkPaySchema, // Use bulk schema
      execute: processMultiplePayments, // Use bulk execution logic
    }),
  };
}

/* BULK SCHEMA */

export const bulkDetailsSchema = z.object({
  accountNumber: z
    .string()
    .describe('The 10-digit account number to be verified'),

  detectedBank: z
    .string()
    .describe(
      'A bank name detected from the user input message. Return an empty string if no bank name is detected',
    ),

  amount: z
    .number()
    .positive()
    .nullable()
    .describe(
      'The payment amount in the local currency, extracted from user input. This can be null if you cannot determine the amount',
    ),
});

export const validBankNameSchema = z.object({
  validBankName: z
    .string()
    .describe(
      'The closest valid bank name, return an empty string  if you could not determine a valid bank name',
    ),
  error: z
    .string()
    .nullable()
    .describe(
      'Error message for the user you could not determine the bank name',
    ),
});
