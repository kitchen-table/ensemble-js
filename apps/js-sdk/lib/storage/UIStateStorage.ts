import { effect, signal } from '@preact/signals';

class UIStateStorage {
  private key: string = 'kitchen-table-ui-state';
  private storage: Storage = localStorage;
  private stateSignal = signal({
    FABOpenState: false,
  });

  constructor() {
    const prevState = this.storage.getItem(this.key);
    if (prevState) {
      this.stateSignal.value = JSON.parse(prevState);
    }
    effect(() => {
      this.storage.setItem(this.key, JSON.stringify(this.stateSignal.value));
    });
  }

  getFABOpenState() {
    return this.stateSignal.value.FABOpenState;
  }

  setFABOpenState(isOpen: boolean) {
    this.stateSignal.value = {
      ...this.stateSignal.value,
      FABOpenState: isOpen,
    };
  }
}

export default UIStateStorage;
