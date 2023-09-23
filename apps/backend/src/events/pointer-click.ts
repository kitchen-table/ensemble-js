import { EventType, PointerClickInput } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onPointerClick(io: Server, socket: Socket) {
  socket.on(EventType.POINTER_CLICK, (data: PointerClickInput) => {
    //
  });
}
