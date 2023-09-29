import { render } from 'preact';
import { effect, Signal, signal } from '@preact/signals';
import MessageInput from 'ui/Message/MessageInput';
import invariant from 'ts-invariant';

class Message {
  private static containerId = 'kitchen-table-message-container';
  static mousePositionSignal = signal({ x: 0, y: 0 });
  static isVisibleSignal = signal(false);
  static messageSignal = signal('');
  static currentMessagesSignal: Signal<Record<string, string>> = signal({});

  static bindEventHandler() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.isVisibleSignal.value = false;
      }
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      if (e.key === 'Slash' || e.key === '/') {
        this.isVisibleSignal.value = true;
      }
    });

    window.addEventListener('click', () => {
      this.isVisibleSignal.value = false;
    });

    window.addEventListener('pointermove', (e) => {
      this.mousePositionSignal.value = { x: e.clientX, y: e.clientY };
    });
  }

  static onMessageSubmit(handler: (message: string) => void) {
    effect(() => {
      if (this.messageSignal.value === '') {
        return;
      }
      handler(this.messageSignal.value);
    });
  }

  static onMessageReceive(id: string, message: string) {
    this.currentMessagesSignal.value = {
      ...this.currentMessagesSignal.value,
      [id]: message,
    };
  }

  static render() {
    const container = document.createElement('div');
    container.id = this.containerId;
    document.body.appendChild(container);
    render(<MessageRoot />, container);
  }

  static isMessageElement(element: HTMLElement) {
    const container = document.getElementById(this.containerId);
    invariant(container, 'Message container not found');
    return container.contains(element);
  }
}

const MessageRoot = () => {
  return <MessageInput />;
};

export default Message;
