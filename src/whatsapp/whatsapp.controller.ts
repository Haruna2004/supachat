import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('send-message')
  async sendMessage(@Body('to') to: string, @Body('message') message: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.whatsAppService.sendTextMessage(to, message);
  }

  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    if (
      mode === 'subscribe' &&
      token === (process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? 'WHO_ARE_YOU')
    ) {
      return challenge;
    }
    throw new Error('Invalid verification token');
  }

  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.whatsAppService.handleWebhook(payload);
  }
}
