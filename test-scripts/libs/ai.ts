import { AzureChatOpenAI } from "@langchain/openai";
import { type IntentType } from "../utils/types";

import {
  bankNamePrompt,
  bulkPayDetails,
  intent,
  payDetailsPrompt,
  paymentDetails,
  resolvedBank,
} from "../utils/aihelpers";
import { AI_CONFIG } from "../utils/secrets";

const model = new AzureChatOpenAI({
  azureOpenAIApiDeploymentName: AI_CONFIG.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiInstanceName: AI_CONFIG.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiKey: AI_CONFIG.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: AI_CONFIG.AZURE_OPENAI_API_VERSION,
});

export class AIService {
  async detectIntent(content: string): Promise<IntentType> {
    const structuredLlm = model.withStructuredOutput(intent);
    const result = await structuredLlm.invoke(
      `As a Payment Assistant. Determine what the user wants to achieve ${content}`
    );
    return result.intention;
  }

  async getChatReponse(content: string) {
    const result = await model.invoke(content);
    return result.content;
  }

  async extractPaymentDetail(content: string) {
    const structuredLlm = model.withStructuredOutput(paymentDetails);

    const runnable = payDetailsPrompt.pipe(structuredLlm);

    const result = await runnable.invoke({
      userInput: content,
    });

    return result;
  }

  async extractBulkPayDetails(content: string) {
    const structuredLlm = model.withStructuredOutput(bulkPayDetails);
    const runnable = payDetailsPrompt.pipe(structuredLlm);

    const result = await runnable.invoke({
      userInput: content,
    });

    return result;
  }

  async getAIBankName(userBankNameInput: string) {
    const structuredLlm = model.withStructuredOutput(resolvedBank);
    const runnable = bankNamePrompt.pipe(structuredLlm);

    const result = await runnable.invoke({
      userBankNameInput,
    });

    return result.bankName;
  }
}
