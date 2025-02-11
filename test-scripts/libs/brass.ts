import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BANK_CODES } from '../utils/bankCodes';
import { BRASS_SANDBOX_KEY } from '../utils/secrets';

const baseURL = 'https://sandbox-api.getbrass.co';

const PATH = {
  resolveName: '/banking/banks/account-name',
};

export class BrassService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BRASS_SANDBOX_KEY}`,
      },
    });
  }

  async confirmAccount(
    bankCode: string,
    accountNumber: number,
  ): Promise<string | null> {
    try {
      const response: AxiosResponse = await this.api.get(
        `${PATH.resolveName}?bank=${bankCode}&account_number=${accountNumber}`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return response.data.data.account_name;
    } catch (error) {
      console.error(
        'Error Confirming account',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.data,
      );
      return null;
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
