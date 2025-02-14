import { AzureChatOpenAI } from '@langchain/openai';
import { intent, payDetailsObj, payDetailsPrompt } from '../utils/aihelpers';
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
}
