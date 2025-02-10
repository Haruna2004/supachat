/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly client: AxiosInstance;
  private readonly phoneNumberId: string;

  // setup the axios client
  constructor(private configService: ConfigService) {
    this.phoneNumberId =
      this.configService.get('WHATSAPP_PHONE_NUMBER_ID') ??
      'could_not_get_phoneId';

    this.client = axios.create({
      baseURL: `https://graph.facebook.com/v18.0/${this.phoneNumberId}`,
      headers: {
        Authorization: `Bearer ${this.configService.get('WHATSAPP_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // send a text message to number

  async sendTextMessage(to: string, message: string) {
    try {
      const response = await this.client.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  handleWebhook(payload: any) {
    // Process incoming messages here
    console.log('Webhook Payload:', JSON.stringify(payload));

    return { status: 'ok' };
  }
}
