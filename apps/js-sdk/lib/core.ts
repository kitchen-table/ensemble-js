import SendEventBinder from 'sendEventBinder';
import Api from 'api';
import { EventType, PointerMoveOutput, type User } from '@packages/api';
import ReceiveEventListener from 'receiveEventListener';
import Fab from 'ui/FAB';
import invariant from 'ts-invariant';
import Cursor from 'ui/Cursor';
import Message from 'ui/Message';
import ChatStorage from 'storage/ChatStorage';

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
    Cursor.mount();

    this.sendEventBinder.bind(window.addEventListener);
    this.joinRoom();
    await this.setUserList();

    Fab.mount();
    this.renderUserList();

    Message.bindEventHandler();
    Message.render();
    Message.onMessageSubmit((message) => {
      this.api.emit(EventType.CHAT_MESSAGE, { message });
    });

    ChatStorage.init();

    this.receiveEventListener.listenRoomJoin(myInfo.id, (joinUser) => {
      this.users.set(joinUser.id, joinUser);
      this.renderUserList();
    });
    this.receiveEventListener.listenRoomLeave((roomLeaveData) => {
      this.users.delete(roomLeaveData.userId);
      Cursor.delete(roomLeaveData.userId);
      this.renderUserList();
    });
    this.receiveEventListener.listenPointMove((pointerMoveData) => {
      if (pointerMoveData.userId === myInfo.id) {
        return; // not my cursor
      }
      this.moveCursor(pointerMoveData);
    });
    this.receiveEventListener.listenChatMessage((chatMessageData) => {
      const chatUser = this.users.get(chatMessageData.userId);
      invariant(chatUser, `user not found. userId: ${chatMessageData.userId}`);
      ChatStorage.pushMessage({
        userId: chatUser.id,
        userName: chatUser.name,
        userColor: chatUser.color,
        message: chatMessageData.message,
      });
      Message.onMessageReceive(chatMessageData.userId, chatMessageData.message);
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

  private renderUserList() {
    Fab.renderUsers(Array.from(this.users.values()));
  }

  private moveCursor(data: PointerMoveOutput) {
    const cursorUser = this.users.get(data.userId);
    invariant(cursorUser, `user not found. userId: ${data.userId}`);
    const element: HTMLElement | null = document.querySelector(data.element);
    invariant(element, `element not found. selector: ${data.element}`);
    const { top, left } = element.getBoundingClientRect();
    Cursor.move({
      id: data.userId,
      x: data.x + left,
      y: data.y + top,
      color: cursorUser.color,
    });
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId });
    this.sendEventBinder.unbind(window.removeEventListener);
  }
}

export default KitchenTable;
