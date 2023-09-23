import { io, Socket } from 'socket.io-client';
import {
  EventType,
  GuestLoginInput,
  GuestLoginOutput,
  RoomJoinInput,
  RoomJoinOutput,
  RoomLeaveInput,
  RoomUserListInput,
  RoomUserListOutput,
} from '@packages/api';

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

  async login({}: GuestLoginInput): Promise<GuestLoginOutput> {
    return this.socket.emitWithAck(EventType.GUEST_LOGIN, {});
  }

  async getUserList({ roomId }: RoomUserListInput): Promise<RoomUserListOutput> {
    return this.socket.emitWithAck(EventType.ROOM_USER_LIST, { roomId });
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
