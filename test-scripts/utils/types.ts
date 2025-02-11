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
  isConfirmed?: boolean;
  isApproved?: boolean;
}

export interface ConfirmedDetails extends PaymentDetails {
  isConfirmed: boolean;
  bankName: string;
  accountNumber: number;
  bankCode: string;
  recipient: string;
}

export interface BulkDetails {
  allPayable: PaymentDetails[];
  allConfirmed: ConfirmedDetails[];
  isAllConfirmed?: boolean;
  isAllApproved?: boolean;
}
