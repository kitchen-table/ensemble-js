import Api from 'api';
import {
  ChatMessageOutput,
  EventType,
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
      console.log('join user!', data.myInfo);
      this.usersStorage.update(data.myInfo);
    });
  }

  listenRoomLeave() {
    this.api.listen(EventType.ROOM_LEAVE, (data: RoomLeaveOutput) => {
      console.log('leave user!', data.userId);
      this.usersStorage.delete(data.userId);
      this.cursor.deleteCursor(data.userId);
    });
  }

  listenPointMove() {
    this.api.listen(EventType.POINTER_MOVE, (data: PointerMoveOutput) => {
      if (data.userId === this.myInfoStorage.get().id) {
        return; // not my cursor
      }
      const cursorUser = this.usersStorage.get(data.userId);
      invariant(cursorUser, `user not found. userId: ${data.userId}`);
      const element: HTMLElement | null = document.querySelector(data.element);
      invariant(element, `element not found. selector: ${data.element}`);
      const { top, left } = element.getBoundingClientRect();
      this.cursor.moveCursor({
        id: data.userId,
        x: data.x + left,
        y: data.y + top,
        color: cursorUser.color,
      });
    });
  }

  listenPointClick() {
    this.api.listen(EventType.POINTER_CLICK, (data: PointerMoveOutput) => {
      const cursorUser = this.usersStorage.get(data.userId);
      const isMyEvent = cursorUser?.id === this.myInfoStorage.get().id;
      invariant(cursorUser, `user not found. userId: ${data.userId}`);
      const element: HTMLElement | null = document.querySelector(data.element);
      invariant(element, `element not found. selector: ${data.element}`);
      const { top, left } = element.getBoundingClientRect();
      this.cursor.click(
        {
          id: window.crypto.randomUUID(),
          x: data.x + left,
          y: data.y + top,
          color: cursorUser.color,
        },
        isMyEvent,
      );
    });
  }

  listenChatMessage() {
    this.api.listen(EventType.CHAT_MESSAGE, (data: ChatMessageOutput) => {
      const chatUser = this.usersStorage.get(data.userId);
      invariant(chatUser, `user not found. userId: ${data.userId}`);
      this.chatStorage.pushMessage({
        userId: chatUser.id,
        userName: chatUser.name,
        userColor: chatUser.color,
        message: data.message,
      });
      this.message.onMessageReceive(data.userId, data.message);
    });
  }

  listenUpdateUserInfo() {
    this.api.listen(EventType.UPDATE_MY_INFO, (data: UpdateMyInfoOutput) => {
      console.log(data.myInfo);
      this.usersStorage.update(data.myInfo);
    });
  }
}

export default ReceiveEventListener;
