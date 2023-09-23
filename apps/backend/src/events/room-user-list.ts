import { EventType, RoomUserListInput, RoomUserListOutput } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';

// ! emitWithAck only
export function onRoomUserList(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_USER_LIST, async (data: RoomUserListInput, callback: Function) => {
    Logger.log(`[${EventType.ROOM_USER_LIST}] ${JSON.stringify(data)}`);

    // 방에 있는 모든 소켓을 가져옵니다.
    const sockets = await io.in(data.roomId).fetchSockets();

    const output: RoomUserListOutput = {
      success: true,
      users: sockets.map((socket) => socket.data.user),
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    callback(output);
  });
}
