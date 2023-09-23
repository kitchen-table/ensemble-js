import { EventType, RoomUserListInput } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onRoomUserList(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_USER_LIST, (data: RoomUserListInput) => {
    //
  });
}
