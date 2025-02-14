import axios, { AxiosInstance } from 'axios';
import { BANK_CODES } from '../utils/bankCodes';
import { BRASS_CONCIERGE_PAT } from '../utils/secrets';
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

export class BrassService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BRASS_CONCIERGE_PAT}`,
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

  getBankCode(bankName: string) {
    const bankCodes = BANK_CODES.filter((bank) =>
      bank.name.toLowerCase().includes(bankName.toLowerCase()),
    );
    if (bankCodes.length === 0) return '';
    else return bankCodes[0].code;
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

      console.log('payment data sent to brass api: ', paymentData);

      const response = await this.api.post<{ data: object }>(
        `${PATH.createPayment}`,
        paymentData,
      );
      console.log(JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      // console.error(error);
      return { success: false };
    }
  }
}
