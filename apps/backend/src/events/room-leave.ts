import { EventType, RoomLeaveInput } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onRoomLeave(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_LEAVE, (data: RoomLeaveInput) => {
    //
  });
}
