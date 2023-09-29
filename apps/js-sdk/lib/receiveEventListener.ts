import Api from 'api';
import {
  ChatMessageOutput,
  EventType,
  PointerMoveOutput,
  RoomJoinOutput,
  RoomLeaveOutput,
  User,
} from '@packages/api';

class ReceiveEventListener {
  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  listenRoomJoin(myId: string, callback: (data: User) => unknown) {
    this.api.listen(EventType.ROOM_JOIN, (data: RoomJoinOutput) => {
      const isMe = data.myInfo.id === myId;
      if (isMe) {
        return;
      }
      console.log('join user!', data.myInfo);
      callback(data.myInfo);
    });
  }

  listenRoomLeave(callback: (data: RoomLeaveOutput) => unknown) {
    this.api.listen(EventType.ROOM_LEAVE, (data: RoomLeaveOutput) => {
      console.log('leave user!', data.userId);

      callback(data);
    });
  }

  listenPointMove(callback: (data: PointerMoveOutput) => unknown) {
    this.api.listen(EventType.POINTER_MOVE, (data: PointerMoveOutput) => {
      callback(data);
    });
  }

  listenPointClick(callback: (data: PointerMoveOutput) => unknown) {
    this.api.listen(EventType.POINTER_CLICK, (data: PointerMoveOutput) => {
      callback(data);
    });
  }

  listenChatMessage(callback: (data: ChatMessageOutput) => unknown) {
    this.api.listen(EventType.CHAT_MESSAGE, (data: ChatMessageOutput) => {
      callback(data);
    });
  }
}

export default ReceiveEventListener;
