import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../libs/db.service';

@Injectable()
export class VerifyService {
  constructor(private readonly dbService: DatabaseService) {}
  async handleVerify() {
    // do something
    await this.dbService.user.create({
      data: { email: 'harunafaruk@gamil.com', name: 'Haruna' },
    });
  }
}
