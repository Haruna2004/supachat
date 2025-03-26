import { Injectable } from '@nestjs/common';
import { StateService } from '../libs/state.service';
import { AIService } from '../libs/ai.service';
import { HelperService } from 'src/helper/helper.service';

const sts = StateService.getInstance();

@Injectable()
export class IntentService {
  constructor(
    private readonly aiService: AIService,
    private readonly helperService: HelperService,
  ) {}

  async getIntent() {
    const potential_intent = [
      'Initiate_Payment',
      'Initiate_Bulk_Payment',
      'Initiate_Verify_Payment',
    ];

    const intent = await this.aiService.detectIntent(sts.currMessage);
    if (potential_intent.includes(intent)) {
      sts.currentIntent = intent;
    }
  }

  async handleUndetected() {
    const response = await this.aiService.getChatResponse(sts.currMessage);
    await this.helperService.sendWhatsappTextMessage(
      sts.currNumber,
      response as string,
    );
  }
}
