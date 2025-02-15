export type IntentType =
  | 'Initiate_Payment'
  | 'Initiate_Bulk_Payment'
  | 'Initiate_Verify_Payment'
  | 'Could_Not_Detect';

export interface Message {
  role: 'user' | 'asst';
  content: string;
  phoneId?: string;
  sessionId?: string;
}

export interface PaymentDetails {
  amount?: number;
  title?: string;
  recipient?: string;
  accountNumber?: number;
  bankName?: string;
  bankCode?: string;
  bankID?: string;
  isConfirmed?: boolean;
  isApproved?: boolean;
}

export interface ConfirmedDetails extends PaymentDetails {
  isConfirmed: boolean;
  bankName: string;
  accountNumber: number;
  bankID: string;
  bankCode: string;
  recipient: string;
}

export interface BulkDetails {
  allPayable: PaymentDetails[];
  allConfirmed: ConfirmedDetails[];
  isKnown?: boolean;
  isAllConfirmed?: boolean;
  isAllApproved?: boolean;
}

export interface ConfirmAccountResponse {
  data: {
    account_name: string;
    account_number: string;
    bank: {
      data: {
        id: string;
        code: string;
        name: string;
        type: string;
      };
    };
  };
}

export interface ConfirmAccountError {
  error: {
    status: number;
    title: string;
    description: string;
    source: object;
  };
}
