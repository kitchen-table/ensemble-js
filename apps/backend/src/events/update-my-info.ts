import { EventType, UpdateMyInfoOutput, User } from '@packages/api';
import { Server, Socket } from 'socket.io';
import { UpdateMyInfoInput } from '@packages/api';
import { Logger } from '@packages/logger';

export function onUpdateMyInfo(io: Server, socket: Socket) {
  socket.on(EventType.UPDATE_MY_INFO, (data: UpdateMyInfoInput) => {
    Logger.log(`[${EventType.UPDATE_MY_INFO}] ${JSON.stringify(data)}`);

    const user: User = socket.data.user;
    if (data.name) user.name = data.name;
    if (data.color) user.color = data.color;
    if (data.isBackground !== undefined) user.isBackground = data.isBackground;

    const output: UpdateMyInfoOutput = {
      success: true,
      myInfo: socket.data.user,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.UPDATE_MY_INFO, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.UPDATE_MY_INFO, output));
  });
}
