import { effect, signal } from '@preact/signals';

class UIStateStorage {
  private key: string = 'kitchen-table-ui-state';
  private storage: Storage = localStorage;
  private tempStateSignal = signal({
    showFAB: true,
    showMessage: true,
    showCursor: true,
  });
  private stateSignal = signal({
    FABOpenState: true,
  });

  constructor() {
    const prevState = this.storage.getItem(this.key);
    if (prevState) {
      this.stateSignal.value = { ...this.stateSignal.value, ...JSON.parse(prevState) };
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

  getShowFAB() {
    return this.tempStateSignal.value.showFAB;
  }

  setShowFAB(isShow: boolean) {
    this.tempStateSignal.value = {
      ...this.tempStateSignal.value,
      showFAB: isShow,
    };
  }

  getShowCursor() {
    return this.tempStateSignal.value.showCursor;
  }

  setShowCursor(isShow: boolean) {
    this.tempStateSignal.value = {
      ...this.tempStateSignal.value,
      showCursor: isShow,
    };
  }

  getShowMessage() {
    return this.tempStateSignal.value.showMessage;
  }

  setShowMessage(isShow: boolean) {
    this.tempStateSignal.value = {
      ...this.tempStateSignal.value,
      showMessage: isShow,
    };
  }
}

export default UIStateStorage;
