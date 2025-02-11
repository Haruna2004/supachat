import {
  type BulkDetails,
  type IntentType,
  type PaymentDetails,
} from "../utils/types";

export class StateManager {
  private static instance: StateManager;
  private constructor() {}

  currentIntent: IntentType = "Could_Not_Detect";
  content: string = "";
  attemptCount: number = 0;

  paymentDetails: PaymentDetails = {};

  bulkDetails: BulkDetails = {
    allPayable: [],
    allConfirmed: [],
  };

  RESET() {
    this.currentIntent = "Could_Not_Detect";
    this.paymentDetails = {};
    this.bulkDetails = {
      allPayable: [],
      allConfirmed: [],
    };
    this.content = "";
  }

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }
}
