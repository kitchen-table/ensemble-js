import { render } from 'preact';
import { effect, Signal, signal } from '@preact/signals';
import MessageInput from 'ui/Message/MessageInput';
import invariant from 'ts-invariant';
import Api from 'api';
import { resolve, TYPE, wire } from 'di';
import { EventType } from '@packages/api';
import { throttle } from 'utils/throttle';
import UIStateStorage from 'storage/uiStateStorage';
import { debounce } from 'utils/debounce';

type EventKey = keyof WindowEventMap;

class Message {
  static containerId = 'kitchen-table-message-container';
  static inputContainerId = 'kitchen-table-message-input-container';

  static isVisibleSignal = signal(false);
  static messageSignal = signal('');
  static currentMessagesSignal: Signal<Record<string, string>> = signal({});

  events: Map<EventKey, Function> = new Map();
  mousePositionSignal = signal({ x: 0, y: 0 });

  api!: Api;
  uiStateStorage!: UIStateStorage;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'uiStateStorage', TYPE.UI_STATE_STORAGE);

    this.mount();
    this.init();
  }

  private mount() {
    const container = document.createElement('div');
    container.id = Message.containerId;
    document.body.appendChild(container);
    render(<MessageRoot />, container);
  }

  unmount() {
    this.uiStateStorage.setShowMessage(false);
  }

  private init() {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        Message.isVisibleSignal.value = false;
      }
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      if (e.key === 'Slash' || e.key === '/') {
        Message.isVisibleSignal.value = true;
      }
    }

    function onClick() {
      Message.isVisibleSignal.value = false;
    }

    const onPointerMove = (e: PointerEvent) => {
      this.mousePositionSignal.value = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
      };
    };

    this.addMessageSubmitEffect();
    this.addMousePositionEffect();
    this.events.set('keydown', onKeyDown);
    this.events.set('click', onClick);
    this.events.set('pointermove', throttle(onPointerMove, 10));
  }

  bindNativeEventHandler() {
    this.events.forEach((callback, type) => {
      window.addEventListener(type, callback as any);
    });
  }

  unbindNativeEventHandler() {
    this.events.forEach((callback, type) => {
      window.removeEventListener(type, callback as any);
    });
  }

  private addMessageSubmitEffect() {
    const debouncedEmitMessage = debounce((message: string) => {
      this.api.emit(EventType.CHAT_MESSAGE, { message });
    }, 100);
    effect(() => {
      debouncedEmitMessage(Message.messageSignal.value);
    });
  }

  private addMousePositionEffect() {
    effect(() => {
      const mousePosition = this.mousePositionSignal.value;
      const inputContainer = document.querySelector(`#${Message.inputContainerId}`);
      if (!(inputContainer instanceof HTMLDivElement)) {
        return;
      }
      inputContainer.style.left = `${mousePosition.x + 20}px`;
      inputContainer.style.top = `${mousePosition.y + 20}px`;
    });
  }

  public onMessageReceive(id: string, message: string) {
    Message.currentMessagesSignal.value = {
      ...Message.currentMessagesSignal.value,
      [id]: message,
    };
  }

  static hasThis(element: HTMLElement) {
    const container = document.getElementById(this.containerId);
    invariant(container, 'Message container not found');
    return container.contains(element);
  }
}

const MessageRoot = () => {
  const getUIState = resolve(TYPE.UI_STATE_STORAGE);
  if (!getUIState().getShowMessage()) {
    return null;
  }
  return <MessageInput />;
};

export default Message;
