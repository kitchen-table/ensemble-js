import { EventType, PointerMoveInput } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onPointerMove(io: Server, socket: Socket) {
  socket.on(EventType.POINTER_MOVE, (data: PointerMoveInput) => {
    //
  });
}
