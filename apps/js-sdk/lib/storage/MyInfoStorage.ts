import { effect, Signal, signal } from '@preact/signals';
import { User } from '@packages/api';
import invariant from 'ts-invariant';

type MyInfo = User;

const KEY = 'kitchen-table-my-info';
class MyInfoStorage {
  myInfoSignal: Signal<MyInfo | null> = signal(null);

  constructor() {
    const savedInfo = sessionStorage.getItem(KEY);
    if (savedInfo) {
      this.myInfoSignal.value = JSON.parse(savedInfo);
    }
    effect(() => {
      sessionStorage.setItem(KEY, JSON.stringify(this.myInfoSignal.value));
    });
  }

  save(myInfo: MyInfo) {
    this.myInfoSignal.value = myInfo;
  }

  get(): MyInfo {
    const myInfo = this.myInfoSignal.peek();
    invariant(myInfo, 'myInfo is null');
    return myInfo;
  }
}

export default MyInfoStorage;
