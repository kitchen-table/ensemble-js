import Events from './events';
import Api from './api';

class KitchenTable {
  sessionId: string;
  roomId: string;
  api: Api;
  events: Events;

  private constructor(api: Api) {
    this.api = api;
    this.events = new Events(this.api);
    this.sessionId = this.api.sessionId;
    // TODO: hash에 설정된 roomId가 있으면 가져오기
    this.roomId = window.location.origin + window.location.pathname;
    this.setup();
  }

  static async init(server: string) {
    const api = await Api.init(server);

    return new KitchenTable(api);
  }

  private setup() {
    this.api.join({ roomId: this.roomId });
    this.events.bind(window.addEventListener);
    this.bindOnMessage();

    // TODO: cleanup or re-init
    window.addEventListener('locationchange', (evt) => {
      this.cleanup();
    });
  }

  private bindOnMessage() {
    this.api.listen('move', (data) => {
      let isMe = false;
      const cursorId = `kitchen-table-${data.sender}`;
      if (data.sender === this.sessionId) {
        isMe = true;
      }
      const element: HTMLElement = document.querySelector(data.element);
      const cursor: HTMLElement | null = document.querySelector(`#${cursorId}`);
      if (!element) {
        return;
      }
      const { top, left } = element.getBoundingClientRect();
      if (cursor) {
        cursor.style.left = `${left + data.x}px`;
        cursor.style.top = `${top + data.y}px`;
      } else {
        const cursor = document.createElement('div');
        cursor.id = cursorId;
        cursor.style.position = 'absolute';
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = isMe ? 'blue' : 'red';
        cursor.style.left = `${left + data.x}px`;
        cursor.style.top = `${top + data.y}px`;
        document.body.appendChild(cursor);
      }
    });
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId });
    this.events.unbind(window.removeEventListener);
  }
}

export default KitchenTable;
