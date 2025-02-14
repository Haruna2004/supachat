import { AIService } from '../libs/ai';
import { BrassService } from '../libs/brass';
import { HelperSevice } from '../libs/helpers';
import { StateManager } from '../libs/state';
import { BULK_PAY_MESSAGE } from '../utils';
import { type ConfirmedDetails } from '../utils/types';

const stateManager = StateManager.getInstance();
const helpers = new HelperSevice();
const aiService = new AIService();
const brassService = new BrassService();

export class BulkPayment {
  async handleBulkPay() {
    // Acknoledge
    helpers.writeToTerminal(BULK_PAY_MESSAGE);
    const userInput = await helpers.getUserInput();

    await this.extractAllDetails(userInput);

    await this.confirmBulk();

    await this.askApproval();

    this.processBulkPay();

    stateManager.RESET();
  }

  async extractAllDetails(text: string) {
    const extractedDetails = await aiService.extractBulkPayDetails(text);
    //Fix Iterate and check for errors
    stateManager.bulkDetails.allPayable = extractedDetails.allDestination;
  }

  async confirmBulk() {
    const allDestination = stateManager.bulkDetails.allPayable;

    const confirmed = (
      await Promise.all(
        allDestination.map(async ({ bankName, accountNumber, ...rest }) => {
          // check if bank name is given
          if (!bankName?.trim()) return null;

          let bankCode = brassService.getBankCode(bankName);

          if (!bankCode) {
            bankCode = await this.retryBankCodeWithAI(bankName);
          }

          // check if account number is valid
          if (!(accountNumber?.toString().length === 10)) return null;

          const result = await brassService.confirmAccount(
            bankCode,
            accountNumber,
          );

          // check account details is valid
          // if (!resolvedName) return null;
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

          return {
            ...rest, // Preserve existing values
            isConfirmed: true,
            bankCode,
            bankName: bank_name,
            bankID: bank_id,
            accountNumber,
            recipient: account_name,
          };
        }),
      )
    ).filter((item): item is ConfirmedDetails => item !== null);

    stateManager.bulkDetails.allConfirmed = confirmed;
    stateManager.bulkDetails.isAllConfirmed =
      confirmed.length === allDestination.length;
  }

  async askApproval() {
    const allConfirmed = stateManager.bulkDetails.allConfirmed;
    const numOfUnconfirmed = stateManager.bulkDetails.allPayable.length;
    const numOfConfirmed = allConfirmed.length;

    if (allConfirmed.length === 0) {
      helpers.writeToTerminal(`No account was confimred. Session Ended`);
      return;
    }

    console.log(
      `Please review ${numOfConfirmed} of ${numOfUnconfirmed} accounts have been confirmed.`,
    );
    allConfirmed.forEach((account) => {
      console.log(
        `
        Amount:    ₦${account.amount}
        Recipient: ${account.recipient}
        Account:   ${account.accountNumber}
        Bank:      ${account.bankName}
        
        `,
      );
    });
    helpers.writeToTerminal(
      "Enter 'Yes' to approve or 'No' to cancel the payment.",
    );

    const userApproval = await helpers.getUserInput();
    if (userApproval.toLowerCase() === 'yes') {
      stateManager.bulkDetails.isAllApproved = true;
    } else {
      stateManager.bulkDetails.isAllApproved = false;
    }
  }

  async retryBankCodeWithAI(bankName: string) {
    const resolvedBankName = await aiService.getAIBankName(bankName);
    const bankCode = brassService.getBankCode(resolvedBankName);
    return bankCode;
  }

  processBulkPay() {
    if (stateManager.bulkDetails.isAllApproved) {
      console.log(
        'All these payment accounts are sent to Brass for processing',
      );
      console.log(stateManager.bulkDetails.allConfirmed);
    }
  }
}
