import { AzureChatOpenAI } from '@langchain/openai';
import {
  bulkPayDetails,
  intent,
  payDetailsObj,
  payDetailsPrompt,
  bankNamePrompt,
  resolvedBank,
} from '../utils/aihelpers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  private model: AzureChatOpenAI;

  constructor(private configService: ConfigService) {
    this.model = new AzureChatOpenAI({
      azureOpenAIApiKey: this.configService.get<string>('AZURE_OPENAI_API_KEY'),
      azureOpenAIApiVersion: this.configService.get<string>(
        'AZURE_OPENAI_API_VERSION',
      ),
      azureOpenAIApiInstanceName: this.configService.get<string>(
        'AZURE_OPENAI_API_INSTANCE_NAME',
      ),
      azureOpenAIApiDeploymentName: this.configService.get<string>(
        'AZURE_OPENAI_API_DEPLOYMENT_NAME',
      ),
    });
  }

  async detectIntent(text: string) {
    const structuredLlm = this.model.withStructuredOutput(intent);
    const result = await structuredLlm.invoke(
      `As a Payment Assistant. Determine what the user wants to achieve ${text}`,
    );
    return result.intention;
  }

  async extractPaymentDetails(text: string) {
    const structuredLlm = this.model.withStructuredOutput(payDetailsObj);
    const runnable = payDetailsPrompt.pipe(structuredLlm);

    const result = await runnable.invoke({
      userInput: text,
    });

    return result;
  }

  async getChatResponse(text: string) {
    const result = await this.model.invoke(text);
    return result.content;
  }

  async extractBulkPayDetails(text: string) {
    const structuredLlm = this.model.withStructuredOutput(bulkPayDetails);
    const runnable = payDetailsPrompt.pipe(structuredLlm);

    const result = await runnable.invoke({
      userInput: text,
    });

    return result;
  }

  async getAIBankName(userBankNameInput: string) {
    const structuredLlm = this.model.withStructuredOutput(resolvedBank);
    const runnable = bankNamePrompt.pipe(structuredLlm);

    const result = await runnable.invoke({ userBankNameInput });

    return result.bankName;
  }
}
