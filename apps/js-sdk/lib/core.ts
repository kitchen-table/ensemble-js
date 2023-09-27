import SendEventBinder from 'sendEventBinder';
import Api from 'api';
import { EventType, PointerMoveOutput, type User } from '@packages/api';
import ReceiveEventListener from 'receiveEventListener';
import Cursor from 'ui/cursor';
import invariant from 'ts-invariant';

class KitchenTable {
  roomId: string;
  api: Api;
  sendEventBinder: SendEventBinder;
  receiveEventListener: ReceiveEventListener;
  myInfo: User | undefined;
  users: Map<string, User> = new Map();

  private constructor(api: Api) {
    this.api = api;
    this.receiveEventListener = new ReceiveEventListener(this.api);
    this.sendEventBinder = new SendEventBinder(this.api);
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
    Cursor.setUserCursor(myInfo.color);
    this.sendEventBinder.bind(window.addEventListener);
    this.joinRoom();
    await this.setUserList();

    this.receiveEventListener.listenRoomJoin(myInfo.id, (user) => {
      this.users.set(user.id, user);
    });
    this.receiveEventListener.listenRoomLeave((data) => {
      this.users.delete(data.userId);
      Cursor.delete(data.userId);
    });
    this.receiveEventListener.listenPointMove((data) => {
      if (data.userId === myInfo.id) {
        return; // not my cursor
      }
      this.moveCursor(data);
    });

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
    this.users = new Map(users.map((user) => [user.id, user]));
  }

  private moveCursor(data: PointerMoveOutput) {
    const cursorUser = this.users.get(data.userId);
    invariant(cursorUser, `user not found. userId: ${data.userId}`);

    if (!Cursor.get(data.userId)) {
      Cursor.make(data.userId, cursorUser.color);
    }
    const element: HTMLElement | null = document.querySelector(data.element);
    invariant(element, `element not found. selector: ${data.element}`);

    const { top, left } = element.getBoundingClientRect();

    Cursor.move(data.userId, data.x + left, data.y + top);
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId });
    this.sendEventBinder.unbind(window.removeEventListener);
  }
}

export default KitchenTable;
