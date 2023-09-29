import { effect, Signal, signal } from '@preact/signals';
import { User } from '@packages/api';
import invariant from 'ts-invariant';

type MyInfo = User;

class MyInfoStorage {
  private static key = 'kitchen-table-my-info';
  static myInfoSignal: Signal<MyInfo | null> = signal(null);

  static init() {
    const savedInfo = sessionStorage.getItem(this.key);
    if (savedInfo) {
      this.myInfoSignal.value = JSON.parse(savedInfo);
    }
    effect(() => {
      sessionStorage.setItem(this.key, JSON.stringify(this.myInfoSignal.value));
    });
  }

  static save(myInfo: MyInfo) {
    this.myInfoSignal.value = myInfo;
  }

  static get(): MyInfo {
    const myInfo = this.myInfoSignal.peek();
    invariant(myInfo, 'myInfo is null');
    return myInfo;
  }
}

export default MyInfoStorage;
