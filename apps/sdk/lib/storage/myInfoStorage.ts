import { effect, Signal, signal } from '@preact/signals';
import { User } from '@packages/api';
import invariant from 'ts-invariant';
import { BaseStorage } from 'storage/base';

type MyInfo = User;

class MyInfoStorage extends BaseStorage<MyInfo | null> {
  private myInfoSignal: Signal<MyInfo | null> = signal(null);

  constructor() {
    super('ensemble-js-my-info', localStorage);

    this.myInfoSignal.value = this.restoreData(null);
    effect(() => {
      this.setItem(this.myInfoSignal.value);
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
