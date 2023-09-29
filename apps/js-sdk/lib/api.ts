import { io, Socket } from 'socket.io-client';
import {
  EventType,
  GuestLoginInput,
  GuestLoginOutput,
  RoomLeaveInput,
  RoomUserListInput,
  RoomUserListOutput,
} from '@packages/api';
import UsersStorage from 'storage/UsersStorage';
import { TYPE, wire } from 'di';
import MyInfoStorage from 'storage/MyInfoStorage';

class Api {
  usersStorage!: UsersStorage;
  myInfoStorage!: MyInfoStorage;

  private socket: Socket;
  private isReady: boolean = false;

  constructor() {
    wire(this, 'usersStorage', TYPE.USERS_STORAGE);
    wire(this, 'myInfoStorage', TYPE.MY_INFO_STORAGE);

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
    const loginOutput: GuestLoginOutput = await this.socket.emitWithAck(EventType.GUEST_LOGIN, {});
    this.myInfoStorage.save(loginOutput.myInfo);
    return loginOutput;
  }

  joinRoom(roomId: string) {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    this.socket.emit(EventType.ROOM_JOIN, { roomId });
  }

  async getUserList({ roomId }: RoomUserListInput): Promise<RoomUserListOutput> {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    const output: RoomUserListOutput = await this.socket.emitWithAck(EventType.ROOM_USER_LIST, {
      roomId,
    });
    this.usersStorage.set(output.users);
    return output;
  }

  leave({ roomId }: RoomLeaveInput) {
    if (!this.isReady) {
      throw new Error('Api is not ready');
    }
    this.socket.emit(EventType.ROOM_LEAVE, { roomId });
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
