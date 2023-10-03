import Api from 'api';
import {
  ChatMessageOutput,
  EventType,
  PointerClickOutput,
  PointerMoveOutput,
  RoomJoinOutput,
  RoomLeaveOutput,
  UpdateMyInfoOutput,
} from '@packages/api';
import { TYPE, wire } from 'di';
import UsersStorage from 'storage/UsersStorage';
import MyInfoStorage from 'storage/MyInfoStorage';
import Cursor from 'ui/Cursor';
import invariant from 'ts-invariant';
import ChatStorage from 'storage/ChatStorage';
import Message from 'ui/Message';
import { ELEMENT_SELECTOR } from 'utils/constants';

class ReceiveEventListener {
  api!: Api;
  cursor!: Cursor;
  message!: Message;

  myInfoStorage!: MyInfoStorage;
  usersStorage!: UsersStorage;
  chatStorage!: ChatStorage;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'cursor', TYPE.CURSOR);
    wire(this, 'message', TYPE.MESSAGE);

    wire(this, 'myInfoStorage', TYPE.MY_INFO_STORAGE);
    wire(this, 'usersStorage', TYPE.USERS_STORAGE);
    wire(this, 'chatStorage', TYPE.CHAT_STORAGE);
  }

  init() {
    this.listenRoomJoin();
    this.listenRoomLeave();
    this.listenPointMove();
    this.listenPointClick();
    this.listenChatMessage();
    this.listenUpdateUserInfo();
  }

  listenRoomJoin() {
    this.api.listen(EventType.ROOM_JOIN, (data: RoomJoinOutput) => {
      this.usersStorage.update(data.myInfo);
    });
  }

  listenRoomLeave() {
    this.api.listen(EventType.ROOM_LEAVE, (data: RoomLeaveOutput) => {
      this.usersStorage.delete(data.userId);
      this.cursor.deleteCursor(data.userId);
    });
  }

  listenPointMove() {
    this.api.listen(EventType.POINTER_MOVE, (data: PointerMoveOutput) => {
      try {
        const isMyEvent = this.myInfoStorage.isMyId(data.userId);
        if (isMyEvent) {
          return; // not my cursor
        }
        if (data.element === ELEMENT_SELECTOR.HIDE) {
          this.cursor.deleteCursor(data.userId);
          return;
        }
        const cursorInfo = this.getCursorInfo(data);
        this.cursor.moveCursor({ id: data.userId, ...cursorInfo });
      } catch (e) {
        this.cursor.deleteCursor(data.userId);
        invariant.warn(e);
      }
    });
  }

  listenPointClick() {
    this.api.listen(EventType.POINTER_CLICK, (data: PointerClickOutput) => {
      try {
        if (data.element === ELEMENT_SELECTOR.HIDE) {
          this.cursor.deleteCursor(data.userId);
          return;
        }
        const cursorInfo = this.getCursorInfo(data);
        const isMyEvent = this.myInfoStorage.isMyId(data.userId);
        this.cursor.click({ id: window.crypto.randomUUID(), ...cursorInfo }, isMyEvent);
      } catch (e) {
        this.cursor.deleteCursor(data.userId);
        invariant.warn(e);
      }
    });
  }

  private getCursorInfo(data: PointerClickOutput | PointerMoveOutput) {
    const cursorUser = this.usersStorage.get(data.userId);
    const element: HTMLElement | null = document.querySelector(data.element);
    invariant(element, `element not found. selector: ${data.element}`);
    const { top, left } = element.getBoundingClientRect();
    return {
      color: cursorUser.color,
      x: data.x + left,
      y: data.y + top,
    };
  }

  listenChatMessage() {
    this.api.listen(EventType.CHAT_MESSAGE, (data: ChatMessageOutput) => {
      try {
        const chatUser = this.usersStorage.get(data.userId);
        invariant(chatUser, `user not found. userId: ${data.userId}`);
        this.chatStorage.pushMessage({
          userId: chatUser.id,
          userName: chatUser.name,
          userColor: chatUser.color,
          message: data.message,
        });
        this.message.onMessageReceive(data.userId, data.message);
      } catch (e) {
        invariant.error(e);
      }
    });
  }

  listenUpdateUserInfo() {
    this.api.listen(EventType.UPDATE_MY_INFO, (data: UpdateMyInfoOutput) => {
      try {
        const isMyInfoUpdate = this.myInfoStorage.isMyId(data.myInfo.id);
        if (isMyInfoUpdate) {
          this.myInfoStorage.save(data.myInfo);
          this.cursor.setUserCursor(data.myInfo.color);
        }
        this.usersStorage.update(data.myInfo);
      } catch (e) {
        invariant.error(e);
      }
    });
  }
}

export default ReceiveEventListener;
