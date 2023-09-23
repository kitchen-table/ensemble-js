import { ChatMessageInput, EventType } from '@packages/api';
import { Server, Socket } from 'socket.io';

export async function onChatMessage(io: Server, socket: Socket) {
  socket.on(EventType.CHAT_MESSAGE, (data: ChatMessageInput) => {
    //
  });
}
