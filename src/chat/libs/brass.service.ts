import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { BANK_CODES } from '../utils/bankCodes';
import {
  ConfirmAccountError,
  ConfirmAccountResponse,
  PaymentDetails,
} from '../utils/types';
const baseURL = 'https://api.getbrass.co';
const PATH = {
  resolveName: '/banking/banks/account-name',
  createPayment: '/banking/payments',
};

@Injectable()
export class BrassService {
  private readonly api: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('BRASS_CONCIERGE_PAT');
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async confirmAccount(bankCode: string, accountNumber: number) {
    try {
      const response = await this.api.get<ConfirmAccountResponse>(
        `${PATH.resolveName}?bank=${bankCode}&account_number=${accountNumber}`,
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError<ConfirmAccountError>(error)) {
        const errorData = error.response?.data;

        if (errorData?.error.status === 422) {
          return {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: errorData.error.description,
            },
          };
        }
      }

      // Handle unknown errors
      return {
        success: false,
        error: {
          code: 'UKNOWN_ERROR',
          message: 'An unexpected error occured',
        },
      };
    }
  }

  async createPayment(payable: PaymentDetails) {
    try {
      if (!payable.amount) {
        throw new Error('Amount is required');
      }

      const paymentData = {
        status: 'pending',
        title: `Concierge - ${payable.title}`,
        amount: payable.amount * 100,
        to: {
          name: payable.recipient,
          account_number: payable.accountNumber,
          bank: payable.bankID,
        },
      };

      console.log('Payment Data to Brass: ', paymentData);

      const response = await this.api.post<{ data: object }>(
        `${PATH.createPayment}`,
        paymentData,
      );
      console.log('Payment Success: ', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error('Payment Failed');
      return { success: false };
    }
  }

  getBankCode(bankName: string) {
    const bankCodes = BANK_CODES.filter((bank) =>
      bank.name.toLowerCase().includes(bankName.toLowerCase()),
    );

    if (bankCodes.length === 0) return '';
    else return bankCodes[0].code;
  }
}
