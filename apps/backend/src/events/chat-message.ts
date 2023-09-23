import { ChatMessageInput, ChatMessageOutput, EventType, User } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';

export function onChatMessage(io: Server, socket: Socket) {
  socket.on(EventType.CHAT_MESSAGE, (data: ChatMessageInput) => {
    Logger.log(`[${EventType.CHAT_MESSAGE}] ${JSON.stringify(data)}`);

    const user: User = socket.data.user;

    const output: ChatMessageOutput = {
      success: true,
      userId: user.id,
      message: data.message,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.CHAT_MESSAGE, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.CHAT_MESSAGE, output));
  });
}
