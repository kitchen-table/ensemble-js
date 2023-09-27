import Api from 'api';
import { EventType, PointerMoveOutput, RoomJoinOutput, RoomLeaveOutput, User } from '@packages/api';

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
}

export default ReceiveEventListener;
