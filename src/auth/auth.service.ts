import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axios.post<{ data: object }>(
        'https://api.getbrass.co/auth/login',
        {
          username: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer lk_R1XkU0bQTQsVbPJGbi3Wl5iWOQ1KEV6zytoTeFRQs0',
            'content-type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<object>(error)) {
        console.log('Brass API Error', error.response?.data);
        return error.response?.data;
      }
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async authorize(authData: { token: string; otp: string }) {
    try {
      const response = await axios.post<{ data: object }>(
        'https://api.getbrass.co/auth/login/authorise',
        {
          otp: authData.otp,
        },
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authData.token}`,
            'content-type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<object>(error)) {
        console.log('Brass API Error', error.response?.data);
        return error.response?.data;
      }
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
