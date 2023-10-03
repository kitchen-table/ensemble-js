import { effect, signal } from '@preact/signals';
import { User } from '@packages/api';

type Chat = {
  userId: User['id'];
  userName: User['name'];
  userColor: User['color'];
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
