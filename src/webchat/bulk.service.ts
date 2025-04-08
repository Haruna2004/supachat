import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { z } from 'zod';
import { bulkDetailsSchema } from './ai/aitools';
import { BrassService } from './brass.service';
import { BulkClientMessage } from './webchat.types';
import { paymentDetails } from 'labs/test-scripts/utils/aihelpers';
import { BANK_LIST } from './lib/bankList';

interface ConfirmedType {
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

@Injectable()
export class BulkService {
  constructor(
    private readonly aiService: AiService,
    private readonly brassService: BrassService,
  ) {}
  private brassToken: string;
  private createPaymentError(
    payment: z.infer<typeof bulkDetailsSchema>,
    error: string,
  ): ConfirmedType {
    return {
      success: false,
      paymentDetails: {
        accountNumber: payment.accountNumber,
        bankID: '',
        resolvedName: '',
        resolvedBankName: payment.detectedBank,
        amount: payment.amount || 0,
      },
      error,
    };
  }

  /* MAIN METHOD */

  async handleBulk({ message, brassToken }: BulkClientMessage) {
    this.brassToken = brassToken;
    const detectedPayments = await this.detectPayments(message);
    const confirmedPayments = await this.confirmPayments(detectedPayments);
    return Response.json({confirmedPayments})
  }

  /* CORE METHODS */

  async detectPayments(message: string) {
    const accounts = await this.aiService.extractDetails(message);
    console.log('Detected: \n', accounts);
    return accounts;
  }

  async confirmPayments(detected: z.infer<typeof bulkDetailsSchema>[]) {
    const result = await Promise.all(
      detected.map(async (payment) => {

        if (!payment.amount)
          return this.createPaymentError(payment, 'Could not determine amount');

        const bankResult = await this.getBankCode(payment.detectedBank);
        if (bankResult.error)
          return this.createPaymentError(payment, bankResult.error);

        const accountResult = await this.resolveAccountDetails(
          bankResult.code,
          payment.accountNumber,
        );

        if (!accountResult.success)
          return this.createPaymentError(
            payment,
            accountResult.error as string,
          );

        return {
          success: true,
          paymentDetails: {
            accountNumber: accountResult.accountNumber,
            bankID: accountResult.bankID,
            resolvedName: accountResult.resolvedName,
            resolvedBankName: bankResult.name,
            amount: payment.amount,
          },
        };
      }),
    );
    console.log('Confirmed Payments: \n',result)
    return result;
  }

  /* HELPER METHODS */

  async getBankCode(bankName: string) {
    const { error, validBankName } =
      await this.aiService.getValidBankName(bankName);
    if (error) return { error, code: '' };
    const code = BANK_LIST[validBankName];
    if (!code) return { error: 'Bank not found', code: '' };
    return { code, name: validBankName, error };
  }

  async resolveAccountDetails(bankCode: string, accountNumber: number) {
    const result = await this.brassService.confirmAccount(
      bankCode,
      accountNumber,
      this.brassToken,
    );

    const accountDetails = {
      success: result.success,
      accountNumber: result.data?.account_number as string,
      bankID: result.data?.bank?.data?.id as string,
      resolvedName: result.data?.account_name as string,
      error: result.error
        ? `${result.error?.code}|${result.error?.message}`
        : null,
    };

    return accountDetails;
  }
}
