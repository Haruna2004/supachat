import { AIService } from '../libs/ai';
import { BrassService } from '../libs/brass';
import { HelperSevice } from '../libs/helpers';
import { StateManager } from '../libs/state';

const aiService = new AIService();
const helpers = new HelperSevice();
const stateManager = StateManager.getInstance();
const brassService = new BrassService();

export class Payment {
  async handlePayment(text: string) {
    await this.extractDetails(text);
    await this.confirmDetails();
    this.approvePayment();
    await this.sendPayment();
  }

  async extractDetails(text: string) {
    // skip this if account is already confirmed
    if (stateManager.paymentDetails.isConfirmed) return;
    const extractedDetails = await aiService.extractPaymentDetail(text);
    //Fix Iterate and check for errors
    stateManager.paymentDetails = extractedDetails;
  }

  async confirmDetails() {
    // skip this if account is already confirmed
    if (stateManager.paymentDetails.isConfirmed) return;

    const accountDetails = stateManager.paymentDetails;
    const { bankName, accountNumber } = accountDetails;

    if (!bankName?.trim()) return null;

    const bankCode = brassService.getBankCode(bankName);

    // if (!bankCode) {
    //   bankCode = await this.retryBankCodeWithAI(bankName);
    // }

    // check if account number is valid
    if (!(accountNumber?.toString().length === 10)) return null;

    const result = await brassService.confirmAccount(bankCode, accountNumber);

    // check account details is valid
    if (!result.success || !result.data) return null;

    const {
      data: {
        account_name,
        bank: {
          data: { id: bank_id, name: bank_name },
        },
      },
    } = result;

    stateManager.paymentDetails = {
      ...accountDetails,
      bankCode,
      bankName: bank_name,
      bankID: bank_id,
      accountNumber,
      recipient: account_name,
      isConfirmed: true,
    };

    // ask for approval

    helpers.writeToTerminal(`
      Please review the payment details:
      Amount:    ₦${accountDetails.amount}
      Recipient: ${account_name}
      Account:   ${accountNumber}
      Bank:      ${bankName}

      Type 'Yes' to confirm or 'No' to cancel the payment.`);

    return true;
  }

  approvePayment() {
    const accountDetails = stateManager.paymentDetails;
    if (!accountDetails.isConfirmed) {
      helpers.writeToTerminal(`Could not confirm account`);
      stateManager.RESET();
      return;
    }

    if (accountDetails.isApproved) return;

    const userInput = stateManager.content;

    if (userInput.trim().toLowerCase() === 'yes') {
      stateManager.paymentDetails.isApproved = true;
    } else if (userInput.trim().toLowerCase() === 'no') {
      helpers.writeToTerminal(`Canceling payment and session ended`);
      stateManager.RESET();
      return;
    } else if (accountDetails.isApproved !== undefined) {
      helpers.writeToTerminal(
        `I could not process your request. please enter  'yes' or 'no' again.`,
      );
    }
  }

  async sendPayment() {
    const accountDetails = stateManager.paymentDetails;
    if (!accountDetails.isApproved) return;

    const result = await brassService.createPayment(accountDetails);

    if (result.success) {
      console.log(
        `Payment of ${accountDetails.amount} to ${accountDetails.recipient} is successful ✔️`,
      );
    } else {
      console.log(
        `Payment of ${accountDetails.amount} to ${accountDetails.recipient} failed ❌`,
      );
    }
    console.log('Session Ended');

    stateManager.RESET();
  }
}
