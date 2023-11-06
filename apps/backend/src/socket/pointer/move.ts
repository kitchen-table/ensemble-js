import { EventType, PointerMoveInput, PointerMoveOutput, User } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';

export function onPointerMove(io: Server, socket: Socket) {
  socket.on(EventType.POINTER_MOVE, (data: PointerMoveInput) => {
    Logger.log(`[${EventType.POINTER_MOVE}] ${JSON.stringify(data)}`);

    const user: User = socket.data.user;

    const output: PointerMoveOutput = {
      success: true,
      userId: user.id,
      element: data.element,
      x: data.x,
      y: data.y,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.POINTER_MOVE, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.POINTER_MOVE, output));
  });
}
