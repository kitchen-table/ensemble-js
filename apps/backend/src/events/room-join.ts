import { EventType, RoomJoinInput, RoomJoinOutput } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';

export function onRoomJoin(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_JOIN, (data: RoomJoinInput) => {
    Logger.log(`[${EventType.ROOM_JOIN}] ${JSON.stringify(data)}`);

    // 방에 들어갑니다.
    socket.join(data.roomId);

    const output: RoomJoinOutput = {
      success: true,
      myInfo: socket.data.user,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.ROOM_JOIN, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.ROOM_JOIN, output));
  });
}
