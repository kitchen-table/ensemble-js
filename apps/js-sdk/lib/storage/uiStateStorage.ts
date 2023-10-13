import { effect, signal } from '@preact/signals';
import { BaseStorage } from 'storage/base';

type PersistUIState = {
  FABOpenState: boolean;
};

class UIStateStorage extends BaseStorage<PersistUIState> {
  private inMemoryStateSignal = signal({
    showFAB: true,
    showMessage: true,
    showCursor: true,
  });
  private stateSignal = signal({
    FABOpenState: true,
  });

  constructor() {
    super('kitchen-table-ui-state', localStorage);
    this.stateSignal.value = this.restoreData({
      FABOpenState: true,
    });
    effect(() => {
      this.setItem(this.stateSignal.value);
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
    return this.inMemoryStateSignal.value.showFAB;
  }

  setShowFAB(isShow: boolean) {
    this.inMemoryStateSignal.value = {
      ...this.inMemoryStateSignal.value,
      showFAB: isShow,
    };
  }

  getShowCursor() {
    return this.inMemoryStateSignal.value.showCursor;
  }

  setShowCursor(isShow: boolean) {
    this.inMemoryStateSignal.value = {
      ...this.inMemoryStateSignal.value,
      showCursor: isShow,
    };
  }

  getShowMessage() {
    return this.inMemoryStateSignal.value.showMessage;
  }

  setShowMessage(isShow: boolean) {
    this.inMemoryStateSignal.value = {
      ...this.inMemoryStateSignal.value,
      showMessage: isShow,
    };
  }
}

export default UIStateStorage;
