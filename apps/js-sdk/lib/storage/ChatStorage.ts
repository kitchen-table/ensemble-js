import { effect, Signal, signal } from '@preact/signals';

type Chat = {
  userId: string;
  userName: string;
  userColor: string;
  message: string;
  timestamp: number;
};

class ChatStorage {
  static messageListSignal: Signal<Chat[]> = signal([]);

  static init() {
    const savedMessages = sessionStorage.getItem('kitchen-table-message-list');
    if (savedMessages) {
      this.messageListSignal.value = JSON.parse(savedMessages);
    }
    effect(() => {
      console.log('messageListSignal');
      sessionStorage.setItem(
        'kitchen-table-message-list',
        JSON.stringify(this.messageListSignal.value),
      );
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
