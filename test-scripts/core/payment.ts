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
    await this.askApproval();

    stateManager.RESET();
  }

  async extractDetails(text: string) {
    const extractedDetails = await aiService.extractPaymentDetail(text);
    //Fix Iterate and check for errors
    stateManager.paymentDetails = extractedDetails;
  }

  async askApproval() {
    const accountDetails = stateManager.paymentDetails;

    if (!accountDetails.isConfirmed) {
      helpers.writeToTerminal(`Could not confirm accuont`);
      return;
    }

    const { amount, recipient, accountNumber, bankName } = accountDetails;

    helpers.writeToTerminal(`
      Please review the payment details:
      Amount:    ₦${amount}
      Recipient: ${recipient}
      Account:   ${accountNumber}
      Bank:      ${bankName}

      Type 'Yes' to confirm or 'No' to cancel the payment.`);

    const userComfirm = await helpers.getUserInput();

    if (userComfirm.toLowerCase() === 'yes') {
      // call brass to make the payment
      console.log(
        'Approved Payment Request sent to Brass',
        stateManager.paymentDetails,
      );
    }
  }

  async confirmDetails() {
    const accountDetails = stateManager.paymentDetails;
    const { bankName, accountNumber } = accountDetails;

    if (!bankName?.trim()) return null;

    const bankCode = brassService.getBankCode(bankName);

    // if (!bankCode) {
    //   bankCode = await this.retryBankCodeWithAI(bankName);
    // }

    // check if account number is valid
    if (!(accountNumber?.toString().length === 10)) return null;

    const resolvedName = await brassService.confirmAccount(
      bankCode,
      accountNumber,
    );

    // check account details is valid
    if (!resolvedName) return null;

    stateManager.paymentDetails = {
      ...accountDetails,
      bankCode,
      bankName,
      accountNumber,
      recipient: resolvedName,
      isConfirmed: true,
    };
  }
}
