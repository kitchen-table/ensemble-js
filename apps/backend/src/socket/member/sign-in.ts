import { EventType, GuestLoginInput, GuestLoginOutput, HexCode, User } from '@packages/api';
import { Logger } from '@packages/logger';
import { Server, Socket } from 'socket.io';
import { faker } from '@faker-js/faker';

function randomColor(): HexCode {
  const chars: string = '0123456789ABCDEF';
  let length: number = 6;
  let hex: string = '';
  while (length--) hex += chars[(Math.random() * 16) | 0];
  return `#${hex}`;
}

// ! emitWithAck only
export function onGuestLogin(io: Server, socket: Socket) {
  socket.on(EventType.GUEST_LOGIN, (data: GuestLoginInput, callback: Function) => {
    Logger.log(`[${EventType.GUEST_LOGIN}] ${JSON.stringify(data)}`);

    // 유저 정보를 생성합니다.
    const user: User = {
      id: crypto.randomUUID(),
      name: `${faker.person.fullName()}`,
      color: randomColor(),
      createdAt: new Date().toISOString(),
      isBackground: false,
    };
    socket.data.user = user;

    const output: GuestLoginOutput = {
      success: true,
      myInfo: socket.data.user,
    };

    console.log(randomColor());

    // 메시지를 보낸 유저에게 메시지를 전송합니다.
    callback(output);
  });
}
