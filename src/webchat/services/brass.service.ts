import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { BANK_CODES } from '../../chat/utils/bankCodes';
import {
  ConfirmAccountError,
  ConfirmAccountResponse,
} from '../../chat/utils/types';
import { BrassPayable } from '../webchat.types';
const baseURL = 'https://api.getbrass.co';
const PATH = {
  resolveName: '/banking/banks/account-name',
  createPayment: '/banking/payments/create',
};

@Injectable()
export class BrassService {
  private readonly api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async confirmAccount(
    bankCode: string,
    accountNumber: string,
    brassToken?: string,
  ) {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${brassToken}`,
        },
      };
      const response = await this.api.get<ConfirmAccountResponse>(
        `${PATH.resolveName}?bank=${bankCode}&account_number=${accountNumber}`,
        options,
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // console.log('Confirmation Error', error);
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

  async createPayment(payable: BrassPayable, brassToken?: string) {
    try {
      // make api request to payment endpoint
      const response = await this.api.post<{ data: object }>(
        `${PATH.createPayment}`,
        payable,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${brassToken}`,
          },
        },
      );

      const result = response.data.data;

      if (!result) {
        return { success: false, message: 'Error from request' };
      }

      console.log('Payment Success');

      return { success: true, data: {} };
    } catch (error) {
      console.log('Payment Failed');
      if (axios.isAxiosError<object>(error)) {
        console.log('Error Data', error.response?.data);
      }

      return { success: false, message: 'Error from request' };
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
