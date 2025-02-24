import { CoreMessage } from 'ai';

export interface ClientMessage {
  id: string;
  messages: CoreMessage[];
}
