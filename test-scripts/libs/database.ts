import { type Message } from "../utils/types";

export class Database {
  private messages: Message[] = [];

  saveMessage(newMessage: Message) {
    this.messages.push(newMessage);
  }

  getSessionMessages(sessionId: string) {
    const retrieved = this.messages.filter(
      (message) => message.sessionId === sessionId
    );
    return retrieved;
  }

  getUserMessages(phoneId: string) {
    const retrieved = this.messages.filter(
      (message) => message.phoneId === phoneId
    );
    return retrieved;
  }
}
