import { effect, Signal, signal } from '@preact/signals';

type Chat = {
  userId: string;
  userName: string;
  userColor: string;
  message: string;
  timestamp: number;
};

const KEY = 'kitchen-table-message-list';

class ChatStorage {
  messages = signal<Chat[]>([]);

  constructor() {
    const savedMessages = sessionStorage.getItem(KEY);
    if (savedMessages) {
      this.messages.value = JSON.parse(savedMessages);
    }
    effect(() => {
      sessionStorage.setItem(KEY, JSON.stringify(this.messages.value));
    });
  }

  pushMessage(chat: Omit<Chat, 'timestamp'>) {
    this.messages.value = this.messages.value.concat({
      ...chat,
      timestamp: Date.now(),
    });
  }
}

export default ChatStorage;
