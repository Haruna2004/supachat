import { BulkPayment } from '../core/bulkPay';
import { IntentService } from '../core/intent';
import { Payment } from '../core/payment';
import { VerifyPayment } from '../core/verifyPay';
import { StateManager } from './state';

const intentService = new IntentService();
const payment = new Payment();
const bulkPayment = new BulkPayment();
const verifyPayment = new VerifyPayment();
const stateManager = StateManager.getInstance();

export class Processor {
  async handleInput(userInput: string) {
    stateManager.content = userInput;

    await intentService.checkIntent();

    switch (stateManager.currentIntent) {
      case 'Initiate_Payment':
        await payment.handlePayment(stateManager.content);
        break;
      case 'Initiate_Verify_Payment':
        verifyPayment.handleVerify(stateManager.content);
        break;
      case 'Initiate_Bulk_Payment':
        await bulkPayment.handleBulkPay();
        break;
      default:
        await intentService.handleUndetectable(stateManager.content);
    }
  }
}
