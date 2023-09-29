import { render } from 'preact';
import { effect, Signal, signal } from '@preact/signals';
import MessageInput from 'ui/Message/MessageInput';
import invariant from 'ts-invariant';
import Api from 'api';
import { TYPE, wire } from 'di';
import { EventType } from '@packages/api';

class Message {
  static containerId = 'kitchen-table-message-container';
  static mousePositionSignal = signal({ x: 0, y: 0 });
  static isVisibleSignal = signal(false);
  static messageSignal = signal('');
  static currentMessagesSignal: Signal<Record<string, string>> = signal({});

  api!: Api;

  constructor() {
    wire(this, 'api', TYPE.API);
    this.mount();
  }

  mount() {
    const container = document.createElement('div');
    container.id = Message.containerId;
    document.body.appendChild(container);
    render(<MessageRoot />, container);
  }

  bindNativeEventHandler() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Message.isVisibleSignal.value = false;
      }
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      if (e.key === 'Slash' || e.key === '/') {
        Message.isVisibleSignal.value = true;
      }
    });

    window.addEventListener('click', () => {
      Message.isVisibleSignal.value = false;
    });

    window.addEventListener('pointermove', (e) => {
      Message.mousePositionSignal.value = { x: e.clientX, y: e.clientY };
    });
  }

  bindSubmitMessage() {
    effect(() => {
      if (Message.messageSignal.value === '') {
        return;
      }
      this.api.emit(EventType.CHAT_MESSAGE, { message: Message.messageSignal.value });
    });
  }

  onMessageReceive(id: string, message: string) {
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
