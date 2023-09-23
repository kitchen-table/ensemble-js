import { EventType, RoomJoinInput, RoomJoinOutput, User } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';
import { faker } from '@faker-js/faker';

export function onRoomJoin(io: Server, socket: Socket) {
  socket.on(EventType.ROOM_JOIN, (data: RoomJoinInput) => {
    Logger.log(`[${EventType.ROOM_JOIN}] ${JSON.stringify(data)}`);

    // 유저 정보를 생성합니다.
    const user: User = {
      id: crypto.randomUUID(),
      name: `${faker.person.fullName()}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      createdAt: new Date().toISOString(),
      isBackground: false,
    };
    socket.data.user = user;

    // 방에 들어갑니다.
    socket.join(data.roomId);

    const output: RoomJoinOutput = {
      success: true,
      myInfo: socket.data.user,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    socket.emit(EventType.ROOM_JOIN, output);

    // 같은 방에 있는 다른 모든 유저들에게 메시지를 전송합니다.
    socket.rooms.forEach((roomId) => socket.to(roomId).emit(EventType.ROOM_JOIN, output));
  });
}
