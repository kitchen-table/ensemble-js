import { io, Socket } from 'socket.io-client';
import {
  EventType,
  GuestLoginInput,
  GuestLoginOutput,
  RoomLeaveInput,
  RoomUserListInput,
  RoomUserListOutput,
  UpdateMyInfoInput,
} from '@packages/api';
import UsersStorage from 'storage/UsersStorage';
import { TYPE, wire } from 'di';

class Api {
  usersStorage!: UsersStorage;

  private socket: Socket;
  private isReady: boolean = false;

  constructor() {
    wire(this, 'usersStorage', TYPE.USERS_STORAGE);

    this.socket = io('http://localhost:3000');
    this.init().then(() => (this.isReady = true));
  }

  async init(): Promise<Api> {
    return new Promise((resolve, reject) => {
      if (this.isReady) {
        resolve(this);
        return;
      }
      this.socket.on('connect', () => resolve(this));
      this.socket.on('connect_error', reject);
    });
  }

  async login({}: GuestLoginInput): Promise<GuestLoginOutput> {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    return await this.socket.emitWithAck(EventType.GUEST_LOGIN, {});
  }

  joinRoom(roomId: string) {
    this.emit(EventType.ROOM_JOIN, { roomId });
  }

  updateMyInfo(myInfo: UpdateMyInfoInput) {
    this.emit(EventType.UPDATE_MY_INFO, myInfo);
  }

  async getUserList({ roomId }: RoomUserListInput): Promise<RoomUserListOutput> {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    const output: RoomUserListOutput = await this.socket.emitWithAck(EventType.ROOM_USER_LIST, {
      roomId,
    });
    this.usersStorage.setUsers(output.users);
    return output;
  }

  leave({ roomId }: RoomLeaveInput) {
    this.emit(EventType.ROOM_LEAVE, { roomId });
    this.socket.close();
  }

  listen(event: string, callback: (...args: any[]) => unknown) {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    this.socket.on(event, callback);
  }

  emit(event: string, payload: any) {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    this.socket.emit(event, payload);
  }
}

export default Api;
