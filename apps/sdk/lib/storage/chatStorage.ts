import { effect, signal } from '@preact/signals';
import { User } from '@packages/api';
import { BaseStorage } from 'storage/base';

type Chat = {
  userId: User['id'];
  userName: User['name'];
  userColor: User['color'];
  message: string;
  timestamp: number;
};

class ChatStorage extends BaseStorage<Chat[]> {
  messages = signal<Chat[]>([]);

  constructor() {
    super('ensemble-js-message-list', sessionStorage);
    this.messages.value = this.restoreData([]);

    effect(() => {
      this.setItem(this.messages.value);
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
