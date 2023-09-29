import { effect, Signal, signal } from '@preact/signals';

type Chat = {
  userId: string;
  userName: string;
  userColor: string;
  message: string;
  timestamp: number;
};

class ChatStorage {
  private static key = 'kitchen-table-message-list';
  static messageListSignal: Signal<Chat[]> = signal([]);

  static init() {
    const savedMessages = sessionStorage.getItem(this.key);
    if (savedMessages) {
      this.messageListSignal.value = JSON.parse(savedMessages);
    }
    effect(() => {
      sessionStorage.setItem(this.key, JSON.stringify(this.messageListSignal.value));
    });
  }

  static pushMessage(chat: Omit<Chat, 'timestamp'>) {
    this.messageListSignal.value = this.messageListSignal.value.concat({
      ...chat,
      timestamp: Date.now(),
    });
  }
}

export default ChatStorage;
