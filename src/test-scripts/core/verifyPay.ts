import { HelperSevice } from '../libs/helpers';
import { StateManager } from '../libs/state';

const stateManager = StateManager.getInstance();
const helpers = new HelperSevice();

export class VerifyPayment {
  handleVerify(text: string) {
    helpers.writeToTerminal('Payment Verified');
    stateManager.RESET();
  }
}
