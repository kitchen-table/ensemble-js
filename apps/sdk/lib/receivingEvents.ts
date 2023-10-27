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
import UsersStorage from 'storage/usersStorage';
import MyInfoStorage from 'storage/myInfoStorage';
import Cursor from 'ui/Cursor';
import invariant from 'ts-invariant';
import ChatStorage from 'storage/chatStorage';
import Message from 'ui/Message';
import { ELEMENT_SELECTOR } from 'utils/constants';
import { getMyPath, isSamePath, parseUserPath } from 'utils/userPath';

class ReceivingEvents {
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

  listenAllEvents() {
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
    const onCursorMove = this.handleHideCursor((data) => {
      if (this.checkIsMyEvent(data.userId)) {
        return; // exclude my cursor
      }
      // Move event is need to update previous cursor position. So, we can use user id.
      const id = data.userId;
      this.cursor.moveCursor({ id, ...this.getCursorInfo(data) });
    });

    this.api.listen(EventType.POINTER_MOVE, onCursorMove);
  }

  listenPointClick() {
    const onCursorClick = this.handleHideCursor((data) => {
      // Click event is no need to update cursor position. So, we can use random id.
      const id = window.crypto.randomUUID();
      const isMyCursor = this.checkIsMyEvent(data.userId);

      this.cursor.click({ id, isMyCursor, ...this.getCursorInfo(data) });
    });

    this.api.listen(EventType.POINTER_CLICK, onCursorClick);
  }

  private handleHideCursor<R>(
    handleCursorInfo: (data: PointerClickOutput | PointerMoveOutput) => R,
  ) {
    return (data: PointerClickOutput | PointerMoveOutput): R | void => {
      try {
        if (this.checkNeedToHide(data)) {
          this.cursor.deleteCursor(data.userId);
          return;
        }
        return handleCursorInfo(data);
      } catch (e) {
        this.cursor.deleteCursor(data.userId);
        invariant.log(e);
      }
    };
  }

  private getCursorInfo(data: PointerClickOutput | PointerMoveOutput) {
    const cursorUser = this.usersStorage.get(data.userId);
    const element: HTMLElement | null = document.querySelector(data.element);
    invariant(element, `element not found. selector: ${data.element}`);
    const { top, left } = element.getBoundingClientRect();
    return {
      name: cursorUser.name,
      color: cursorUser.color,
      x: data.x + left + window.scrollX,
      y: data.y + top + window.scrollY,
    };
  }

  private checkIsMyEvent(userId: string) {
    return this.myInfoStorage.isMyId(userId);
  }

  private checkNeedToHide(data: PointerClickOutput | PointerMoveOutput) {
    if (isHideElement(data.element)) {
      return true;
    }
    const userPath = this.usersStorage.get(data.userId).path;
    if (isEmptyUserPath(userPath)) {
      return true;
    }

    if (isDifferentPathWithMine(userPath)) {
      return true;
    }
    return false;
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
        if (this.checkIsMyEvent(data.myInfo.id)) {
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

export default ReceivingEvents;

function isHideElement(elementSelector: string) {
  return elementSelector === ELEMENT_SELECTOR.HIDE;
}

function isEmptyUserPath(path?: string): path is undefined {
  return !path;
}

function isDifferentPathWithMine(path: string) {
  const myPath = parseUserPath(getMyPath());
  const userPath = parseUserPath(path);

  return !isSamePath(myPath, userPath);
}
