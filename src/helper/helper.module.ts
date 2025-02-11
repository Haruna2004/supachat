import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
