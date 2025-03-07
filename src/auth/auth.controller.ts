import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.login(credentials);
    return res.json(result);
  }

  @Post('login/authorise')
  async authorize(
    @Body() authData: { otp: string; token: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.authorize(authData);
    return res.json(result);
  }

  @Get('banking/accounts')
  async list(@Headers('authorization') authHeader: string) {
    try {
      const brassToken = authHeader && authHeader.split(' ')[1];
      const response = await axios.get<{ data: object }>(
        'https://api.getbrass.co/banking/accounts?page=1&limit=10&include_virtual_accounts=true',
        { headers: { Authorization: `Bearer ${brassToken}` } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<{ data: object }>(error)) {
        console.error(error.response?.data);
        return error.response?.data;
      }
      console.log('Server Error');

      return {
        error: {
          status: 500,
          description: 'An unexpected error occured',
        },
      };
    }
  }

  @Get('banking/accounts/:id')
  async getOne(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    try {
      const brassToken = authHeader && authHeader.split(' ')[1];
      const response = await axios.get<{ data: object }>(
        `https://api.getbrass.co/banking/accounts/${id}`,
        { headers: { Authorization: `Bearer ${brassToken}` } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<{ data: object }>(error)) {
        console.error(error.response);
        return error.response?.data;
      }
      console.log('Server Error');

      return {
        error: {
          status: 500,
          description: 'An unexpected error occured',
        },
      };
    }
  }
}
