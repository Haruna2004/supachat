import { CoreMessage } from 'ai';
import { z } from 'zod';

export interface ClientMessage {
  id: string;
  messages: CoreMessage[];
  brassToken?: string;
  brassAccountId?: string;
}

export interface BulkClientMessage {
  message: string,
  brassToken: string,
  brassAccountId: string
}

export const BrassPayableSchema = z.object({
  customer_reference: z.string(),
  amount: z.number(),
  title: z.string(),
  source_account: z.string(),
  to: z.object({
    account_number: z.string(),
    bank: z.string(),
    name: z.string(),
  }),
});

export type BrassPayable = z.infer<typeof BrassPayableSchema>;

export interface ConfirmedType {
  success: boolean;
  paymentDetails: {
    accountNumber: number;
    bankID: string;
    resolvedName: string;
    resolvedBankName: string;
    amount: number;
  };
  error: string | undefined;
}

