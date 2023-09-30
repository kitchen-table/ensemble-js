import { render } from 'preact';
import { effect, Signal, signal } from '@preact/signals';
import MessageInput from 'ui/Message/MessageInput';
import invariant from 'ts-invariant';
import Api from 'api';
import { TYPE, wire } from 'di';
import { EventType } from '@packages/api';

type EventKey = keyof WindowEventMap;

class Message {
  static containerId = 'kitchen-table-message-container';
  static mousePositionSignal = signal({ x: 0, y: 0 });
  static isVisibleSignal = signal(false);
  static messageSignal = signal('');
  static currentMessagesSignal: Signal<Record<string, string>> = signal({});

  events: Map<EventKey, Function> = new Map();

  api!: Api;

  constructor() {
    wire(this, 'api', TYPE.API);
    this.mount();
    this.init();
  }

  private mount() {
    const container = document.createElement('div');
    container.id = Message.containerId;
    document.body.appendChild(container);
    render(<MessageRoot />, container);
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

    function onPointerMove(e: PointerEvent) {
      Message.mousePositionSignal.value = { x: e.clientX, y: e.clientY };
    }

    this.addMessageSubmitEffect()
    this.events.set('keydown', onKeyDown);
    this.events.set('click', onClick);
    this.events.set('pointermove', onPointerMove);
  }

  bindNativeEventHandler() {
    this.events.forEach((callback, type) => {
      window.addEventListener(type, callback as any);
    });
  }

  private addMessageSubmitEffect() {
    effect(() => {
      if (Message.messageSignal.value === '') {
        return;
      }
      this.api.emit(EventType.CHAT_MESSAGE, { message: Message.messageSignal.value });
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
  return <MessageInput />;
};

export default Message;
