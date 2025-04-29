import { Injectable } from '@nestjs/common';
//@ts-expect-error checklater
import { HelperService } from 'src/helper/helper.service';
import { StateService } from './libs/state.service';
import { IntentService } from './core/intent.service';
import { PaymentService } from './core/payment.service';
import { VerifyService } from './core/verify.service';
import { BulkService } from './core/bulk.service';

const sts = StateService.getInstance();

@Injectable()
export class ChatService {
  constructor(
    private readonly helperService: HelperService,
    private readonly intentService: IntentService,
    private readonly payService: PaymentService,
    private readonly verifyService: VerifyService,
    private readonly bulkService: BulkService,
  ) {}

  async handleInput(userInput: string, sourceNum: string) {
    sts.currMessage = userInput;
    sts.currNumber = sourceNum;
    console.log(`${sourceNum} Message: `, userInput);

    if (sts.currentIntent === 'Could_Not_Detect')
      await this.intentService.getIntent();

    switch (sts.currentIntent) {
      case 'Initiate_Payment':
        await this.payService.handlePayment();
        break;
      case 'Initiate_Bulk_Payment':
        await this.bulkService.handleBulk();
        break;
      case 'Initiate_Verify_Payment':
        await this.verifyService.handleVerify();
        await this.replyMessage('Verifying a payment');
        break;
      default:
        await this.intentService.handleUndetected();
    }
  }

  async replyMessage(text: string) {
    await this.helperService.sendWhatsappTextMessage(sts.currNumber, text);
    sts.RESET();
  }
}
