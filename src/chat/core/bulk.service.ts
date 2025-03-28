import { Injectable } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { StateService } from '../libs/state.service';
import { BULK_PAY_MESSAGE } from '../utils';
import { AIService } from '../libs/ai.service';
import { ConfirmedDetails } from '../utils/types';
import { BrassService } from '../libs/brass.service';

const sts = StateService.getInstance();

@Injectable()
export class BulkService {
  constructor(
    private readonly helperService: HelperService,
    private readonly aiService: AIService,
    private readonly brassService: BrassService,
  ) {}

  async handleBulk() {
    if (await this.acknowledgeBulk()) return;
    await this.extractAllDetails();
    await this.confirmBulk();
    await this.approveBulk();
    await this.processBulkPay();
  }

  async acknowledgeBulk() {
    if (sts.bulkDetails.isKnown) return false;
    await this.helperService.sendWhatsappTextMessage(
      sts.currNumber,
      BULK_PAY_MESSAGE,
    );
    sts.bulkDetails.isKnown = true;
    return true;
  }

  async extractAllDetails() {
    // if not details has been extracted or intent is not known
    if (sts.bulkDetails.allPayable.length !== 0) return;

    const extractedDetails = await this.aiService.extractBulkPayDetails(
      sts.currMessage,
    );
    sts.bulkDetails.allPayable = extractedDetails.allDestination;
  }

  async getBankCodeWithAI(bankName: string) {
    const resolvedBankName = await this.aiService.getAIBankName(bankName);
    const bankCode = this.brassService.getBankCode(resolvedBankName);
    return bankCode;
  }

  async confirmBulk() {
    if (sts.bulkDetails.allConfirmed.length !== 0) return;

    const allDestination = sts.bulkDetails.allPayable;

    const confirmedDetails = (
      await Promise.all(
        allDestination.map(async ({ bankName, accountNumber, ...rest }) => {
          // check if bank name is given
          if (!bankName?.trim()) return null;

          let bankCode = this.brassService.getBankCode(bankName);

          if (!bankCode) {
            bankCode = await this.getBankCodeWithAI(bankName);
          }

          // is the account number valid
          if (!(accountNumber?.toString().length === 10)) return null;

          const result = await this.brassService.confirmAccount(
            bankCode,
            accountNumber,
          );

          if (!result.success) return null;

          const resolvedBank = result.data?.bank.data.name;
          const resolvedName = result.data?.account_name;
          const resolvedBankID = result.data?.bank.data.id;

          return {
            ...rest,
            isConfirmed: true,
            bankCode,
            bankName: resolvedBank,
            bankID: resolvedBankID,
            accountNumber,
            recipient: resolvedName,
          };
        }),
      )
    ).filter((item): item is ConfirmedDetails => item !== null);

    const numOfUnconfirmed = allDestination.length;
    const numOfConfirmed = confirmedDetails.length;

    sts.bulkDetails.allConfirmed = confirmedDetails;
    sts.bulkDetails.isAllConfirmed = numOfConfirmed === numOfUnconfirmed;

    // show approval message

    if (confirmedDetails.length === 0) {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        'No account was confimred. Session Ended',
      );
      sts.RESET();
      return;
    }

    let approvalMsg = '';

    approvalMsg += `Please review ${numOfConfirmed} of ${numOfUnconfirmed} accounts that was confirmed. \n\n`;

    confirmedDetails.forEach(
      (account) =>
        (approvalMsg += `
     Name: ${account.recipient}
     Account: ${account.accountNumber}
     Bank: ${account.bankName}
     Amount: ${account.amount}

    `),
    );

    approvalMsg += '\n';

    approvalMsg += "Enter 'Yes' to approve or 'No' to cancel payments.";

    await this.helperService.sendWhatsappTextMessage(
      sts.currNumber,
      approvalMsg,
    );
  }

  async approveBulk() {
    if (sts.bulkDetails.isAllApproved) return;

    const userInput = sts.currMessage;

    if (userInput.trim().toLowerCase() === 'yes') {
      sts.bulkDetails.isAllApproved = true;
      return;
    } else if (userInput.trim().toLowerCase() === 'no') {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        'Bulk payment has been cancelled and session ended.',
      );
      sts.RESET();
    } else if (sts.bulkDetails.isAllApproved !== undefined) {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        `I could not process your request. please send 'yes' or 'no' again.`,
      );
    }
  }

  async processBulkPay() {
    if (!sts.bulkDetails.isAllApproved) return;

    console.log(sts.bulkDetails.allConfirmed);
    await this.helperService.sendWhatsappTextMessage(
      sts.currNumber,
      // 'Success all Payment has be processed ✔️',
      'Failed to process payments ❌',
    );
    sts.RESET();
  }
}
