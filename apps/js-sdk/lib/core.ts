import EventEmitter from './eventEmitter';
import Api from './api';
import { EventType, PointerMoveOutput, type User } from '@packages/api';

class KitchenTable {
  roomId: string;
  api: Api;
  events: EventEmitter;
  myInfo: User | undefined;

  private constructor(api: Api) {
    this.api = api;
    this.events = new EventEmitter(this.api);
    // TODO: hash에 설정된 roomId가 있으면 가져오기
    this.roomId = window.location.origin + window.location.pathname;
    this.setup();
  }

  static async init(server: string) {
    const api = await Api.init(server);

    return new KitchenTable(api);
  }

  private async setup() {
    const { myInfo } = await this.api.join({ roomId: this.roomId });
    this.myInfo = myInfo;
    this.events.bind(window.addEventListener);
    this.bindOnMessage();

    // TODO: cleanup or re-init
    window.addEventListener('locationchange', (evt) => {
      this.cleanup();
    });
  }

  private bindOnMessage() {
    this.api.listen(EventType.POINTER_MOVE, (data: PointerMoveOutput) => {
      let isMe = false;
      const cursorId = `kitchen-table-${data.userId}`;
      if (data.userId === this.myInfo?.id) {
        isMe = true;
      }
      const element: HTMLElement | null = document.querySelector(data.element);
      if (!element) {
        console.warn(`element not found. selector: ${data.element}`);
        return;
      }
      const cursor: HTMLElement | null = document.querySelector(`#${cursorId}`);
      const { top, left } = element.getBoundingClientRect();
      const cursorLeft = `${left + data.x + scrollX}px`;
      const cursorTop = `${top + data.y + scrollY}px`;
      if (cursor) {
        cursor.style.left = cursorLeft;
        cursor.style.top = cursorTop;
      } else {
        const cursor = document.createElement('div');
        cursor.id = cursorId;
        cursor.style.position = 'absolute';
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = isMe ? 'blue' : 'red';
        cursor.style.left = cursorLeft;
        cursor.style.top = cursorTop;
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
