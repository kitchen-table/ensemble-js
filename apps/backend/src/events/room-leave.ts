import { EventType, RoomLeaveInput, RoomLeaveOutput } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';

export function onRoomLeave(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_LEAVE, (data: RoomLeaveInput) => {
    Logger.log(`[${EventType.ROOM_LEAVE}] ${JSON.stringify(data)}`);

    const output: RoomLeaveOutput = {
      success: true,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.ROOM_LEAVE, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.ROOM_LEAVE, output));

    // 방에서 나갑니다.
    socket.leave(data.roomId);
  });
}
