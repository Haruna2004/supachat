import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebchatService } from './webchat.service';
import { ClientMessage } from './webchat.types';
import { Response } from 'express';

@Controller('webchat')
export class WebchatController {
  constructor(private readonly webchatService: WebchatService) {}
  // /webchat
  @Post()
  process(@Res() res: Response, @Body() messages: ClientMessage) {
    return this.webchatService.process(messages, res);
  }
}
