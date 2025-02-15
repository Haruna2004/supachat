import { Injectable } from '@nestjs/common';
import { StateService } from '../libs/state.service';
import { AIService } from '../libs/ai.service';
import { BrassService } from '../libs/brass.service';
import { HelperService } from 'src/helper/helper.service';
import { formatAmount } from '../utils';

const sts = StateService.getInstance();

@Injectable()
export class PaymentService {
  constructor(
    private readonly aiService: AIService,
    private readonly brassService: BrassService,
    private readonly helperService: HelperService,
  ) {}

  async handlePayment() {
    await this.extractDetails();
    await this.confirmDetails();
    await this.approvePayment();
    await this.sendPayment();
  }

  async extractDetails() {
    // skip if account is already confirmed
    if (sts.paymentDetails.isConfirmed) return;
    const extractedDetails = await this.aiService.extractPaymentDetails(
      sts.currMessage,
    );
    sts.paymentDetails = extractedDetails;
  }

  async confirmDetails() {
    if (sts.paymentDetails.isConfirmed) return;

    const accountDetails = sts.paymentDetails;

    const { bankName, accountNumber, amount } = accountDetails;

    if (!bankName?.trim()) return null;

    const bankCode = this.brassService.getBankCode(bankName);

    // retry bancode with AI rather than return
    if (!bankCode) return null;

    if (!(accountNumber?.toString().length === 10)) return null;

    const result = await this.brassService.confirmAccount(
      bankCode,
      accountNumber,
    );

    if (!result.success) return null;

    const resolvedBank = result.data?.bank.data.name;
    const resolvedName = result.data?.account_name;
    const resolvedBankID = result.data?.bank.data.id;

    sts.paymentDetails = {
      ...accountDetails,
      bankName: resolvedBank,
      recipient: resolvedName,
      bankCode,
      bankID: resolvedBankID,
      accountNumber,
      isConfirmed: true,
    };

    await this.helperService.sendWhatsappTextMessage(
      sts.currNumber,
      `
      Please review the payment details:
      Amount:    ${formatAmount(amount ?? 0)}
      Recipient: ${resolvedName}
      Account:   ${accountNumber}
      Bank:      ${resolvedBank}

      Send 'Yes' to confirm or 'No' to cancel the payment.`,
    );
  }

  async approvePayment() {
    const accountDetails = sts.paymentDetails;
    if (!accountDetails.isConfirmed) {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        'I could not confirm the account. Session Ended.',
      );
      sts.RESET();
      return;
    }

    if (accountDetails.isApproved) return;

    const userInput = sts.currMessage;

    if (userInput.trim().toLowerCase() === 'yes') {
      sts.paymentDetails.isApproved = true;
      return;
    } else if (userInput.trim().toLowerCase() === 'no') {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        'Payment has been cancelled and session ended.',
      );
      sts.RESET();
      return;
    } else if (accountDetails.isApproved !== undefined) {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        `I could not process your request. please send 'yes' or 'no' again.`,
      );
    }
  }

  async sendPayment() {
    const accountDetails = sts.paymentDetails;
    if (!accountDetails.isApproved) return;

    const result = await this.brassService.createPayment(accountDetails);

    const dislayedAmount = formatAmount(accountDetails.amount ?? 0);

    if (result.success) {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        `Your transfer of ${dislayedAmount} to ${accountDetails.recipient} is successful ✔️`,
      );
    } else {
      await this.helperService.sendWhatsappTextMessage(
        sts.currNumber,
        `Your transfer of ${dislayedAmount} to ${accountDetails.recipient} failed ❌`,
      );
    }

    sts.RESET();
  }
}
