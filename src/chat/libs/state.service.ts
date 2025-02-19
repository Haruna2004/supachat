import { Injectable } from '@nestjs/common';
import {
  type PaymentDetails,
  type IntentType,
  BulkDetails,
} from '../utils/types';

@Injectable()
export class StateService {
  private static instance: StateService;

  currentIntent: IntentType = 'Could_Not_Detect';
  currMessage: string = '';
  currNumber: string = '';
  paymentDetails: PaymentDetails = {};

  bulkDetails: BulkDetails = {
    allPayable: [],
    allConfirmed: [],
  };

  RESET() {
    this.currentIntent = 'Could_Not_Detect';
    this.currNumber = '';
    this.currMessage = '';
    this.paymentDetails = {};
    this.bulkDetails = {
      allPayable: [],
      allConfirmed: [],
    };
  }

  static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }
}
