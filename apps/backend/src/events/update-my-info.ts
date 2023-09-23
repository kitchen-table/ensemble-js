import { EventType } from '@packages/api';
import { Server, Socket } from 'socket.io';
import { UpdateMyInfoInput } from '@packages/api';

export async function onUpdateMyInfo(io: Server, socket: Socket) {
  socket.on(EventType.UPDATE_MY_INFO, (data: UpdateMyInfoInput) => {
    //
  });
}
