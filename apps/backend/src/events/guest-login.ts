import { EventType, GuestLoginInput, GuestLoginOutput, User } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';
import { faker } from '@faker-js/faker';

export function onGuestLogin(io: Server, socket: Socket) {
  socket.on(EventType.GUEST_LOGIN, (data: GuestLoginInput, callback: Function) => {
    Logger.log(`[${EventType.GUEST_LOGIN}] ${JSON.stringify(data)}`);

    // 유저 정보를 생성합니다.
    const user: User = {
      id: crypto.randomUUID(),
      name: `${faker.person.fullName()}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      createdAt: new Date().toISOString(),
      isBackground: false,
    };
    socket.data.user = user;

    const output: GuestLoginOutput = {
      success: true,
      myInfo: socket.data.user,
    };

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    callback(output);
  });
}
