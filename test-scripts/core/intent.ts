import { AIService } from '../libs/ai';
import { HelperSevice } from '../libs/helpers';
import { StateManager } from '../libs/state';

const aiService = new AIService();
const stateManager = StateManager.getInstance();
const helpers = new HelperSevice();

export class IntentService {
  async checkIntent() {
    while (stateManager.currentIntent === 'Could_Not_Detect') {
      await this.getIntent(stateManager.content);
    }
  }

  async getIntent(text: string) {
    const potential_intent = [
      'Initiate_Payment',
      'Initiate_Bulk_Payment',
      'Initiate_Verify_Payment',
    ];
    const intent = await aiService.detectIntent(text);
    if (potential_intent.includes(intent)) {
      stateManager.currentIntent = intent;
    } else {
      await this.handleUndetectable(text);
    }
  }

  async handleUndetectable(text: string) {
    const response = await aiService.getChatReponse(text);
    helpers.writeToTerminal(response as string);
    stateManager.content = await helpers.getUserInput();
  }
}
