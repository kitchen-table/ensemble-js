import { io, Socket } from 'socket.io-client';
import { EventType, RoomJoinInput, RoomJoinOutput, RoomLeaveInput } from '@packages/api';

class Api {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    return this;
  }

  static async init(server: string): Promise<Api> {
    const socket = io(server);
    return new Promise((resolve, reject) => {
      socket.on('connect', () => resolve(new Api(socket)));
      socket.on('connect_error', reject);
    });
  }

  async join({ roomId }: RoomJoinInput): Promise<RoomJoinOutput> {
    return this.socket.emitWithAck(EventType.ROOM_JOIN, { roomId });
  }

  leave({ roomId }: RoomLeaveInput) {
    this.socket.emit(EventType.ROOM_LEAVE, { roomId });
    this.socket.close();
  }

  listen(event: string, callback: (...args: any[]) => unknown) {
    this.socket.on(event, callback);
  }

  emit(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}

export default Api;
