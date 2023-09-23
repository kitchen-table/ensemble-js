import EventEmitter from './eventEmitter';
import Api from './api';
import { EventType, PointerMoveOutput, RoomJoinOutput, type User } from '@packages/api';

class KitchenTable {
  roomId: string;
  api: Api;
  events: EventEmitter;
  myInfo: User | undefined;
  userList: User[] = [];

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
    const { myInfo } = await this.api.login({ roomId: this.roomId });
    this.myInfo = myInfo;
    this.events.bind(window.addEventListener);
    this.bindOnMessage();
    this.joinRoom();
    this.setUserList();

    // TODO: cleanup or re-init
    window.addEventListener('locationchange', (evt) => {
      this.cleanup();
    });
  }

  private joinRoom() {
    this.api.emit(EventType.ROOM_JOIN, { roomId: this.roomId });
  }
  private async setUserList() {
    const { users } = await this.api.getUserList({ roomId: this.roomId });
    this.userList = users.filter((user) => user.id !== this.myInfo?.id);
  }

  private bindOnMessage() {
    this.api.listen(EventType.ROOM_JOIN, (data: RoomJoinOutput) => {
      const joinUserInfo = data.myInfo;
      if (joinUserInfo.id === this.myInfo?.id) {
        return;
      }
      console.log('join new user!', joinUserInfo);
    });

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
        const userColor = this.userList.find((user) => user.id === data.userId)?.color ?? 'red';
        const bgColor = isMe ? 'blue' : userColor;
        cursor.id = cursorId;
        cursor.style.position = 'absolute';
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = bgColor;
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
