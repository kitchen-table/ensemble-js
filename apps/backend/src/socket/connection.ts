import * as SocketIO from 'socket.io';
import { onChatMessage } from './chat/message';
import { onGuestLogin } from './member/sign-in';
import { onUpdateMyInfo } from './member/update-my-info';
import { onPointerClick } from './pointer/click';
import { onPointerMove } from './pointer/move';
import { onRoomJoin } from './room/join';
import { onRoomLeave } from './room/leave';
import { onRoomUserList } from './room/member-list';
import { User, RoomLeaveOutput, EventType } from '@packages/api';
export class Connection {
  private constructor() {}

  static init(io: SocketIO.Server, socket: SocketIO.Socket) {
    onGuestLogin(io, socket);
    onChatMessage(io, socket);
    onPointerClick(io, socket);
    onPointerMove(io, socket);
    onRoomJoin(io, socket);
    onRoomLeave(io, socket);
    onRoomUserList(io, socket);
    onUpdateMyInfo(io, socket);

    socket.on('disconnect', () => {
      // 로그인 된 소켓일때만, 나간 유저에 대한 정보를 모든 유저에게 전송함.
      if (socket.data.user) {
        const user: User = socket.data.user;
        const output: RoomLeaveOutput = { success: true, userId: user.id };
        io.emit(EventType.ROOM_LEAVE, output);
      }
    });
  }
}
