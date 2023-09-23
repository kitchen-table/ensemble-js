import { EventType, RoomJoinInput } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onRoomJoin(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_JOIN, (data: RoomJoinInput) => {
    //
  });
}
