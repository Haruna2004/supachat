import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelperService {
  constructor(private readonly configService: ConfigService) {}

  // send whatsapp message to a given user number
  async sendWhatsappTextMessage(destination: string, message: string) {
    const url =
      this.configService.get<string>('GUPSHUP_API_URL') ??
      'https://api.gupshup.io/wa/api/v1/msg';
    const source =
      this.configService.get<string>('GUPSHUP_SOURCE_NUMBER') ?? '';
    const srcName = this.configService.get<string>('GUPSHUP_SRC_NAME') ?? '';
    const apiKey = this.configService.get<string>('GUPSHUP_API_KEY');

    const data = new URLSearchParams();
    data.append('channel', 'whatsapp');
    data.append('source', source);
    data.append('destination', destination);
    data.append(
      'message',
      JSON.stringify({
        type: 'text',
        text: message,
      }),
    );
    data.append('src.name', srcName);

    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: apiKey,
      },
    };

    try {
      const response = await axios.post<{ status: string; messageId: string }>(
        url,
        data,
        config,
      );

      const { status } = response.data;
      if (status === 'submitted') {
        console.log(`${source} Assistant: ${message}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}
