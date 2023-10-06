import { effect, Signal, signal } from '@preact/signals';
import { User } from '@packages/api';
import invariant from 'ts-invariant';

type MyInfo = User;

class MyInfoStorage {
  private key: string = 'kitchen-table-my-info';
  private storage: Storage = localStorage;
  private myInfoSignal: Signal<MyInfo | null> = signal(null);

  constructor() {
    const savedInfo = this.storage.getItem(this.key);
    if (savedInfo) {
      this.myInfoSignal.value = JSON.parse(savedInfo);
    }
    effect(() => {
      this.storage.setItem(this.key, JSON.stringify(this.myInfoSignal.value));
    });
  }

  save(myInfo: MyInfo) {
    this.myInfoSignal.value = myInfo;
  }

  getMyInfo(): MyInfo | null {
    return this.myInfoSignal.value;
  }

  getSnapshot(): MyInfo | null {
    return this.myInfoSignal.peek();
  }

  isMyId(userId: string) {
    const myInfo = this.getSnapshot();
    invariant(myInfo, 'myInfo is null');
    return myInfo.id === userId;
  }
}

export default MyInfoStorage;
