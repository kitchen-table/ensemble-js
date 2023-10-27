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
import UsersStorage from 'storage/usersStorage';
import { TYPE, wire } from 'di';
import Config from 'config';
import { signal } from '@preact/signals';

class Api {
  config!: Config;
  usersStorage!: UsersStorage;

  private socket!: Socket;
  private isLeave = false;
  isReadySignal = signal(false);

  constructor() {
    wire(this, 'config', TYPE.CONFIG);
    wire(this, 'usersStorage', TYPE.USERS_STORAGE);
  }

  retryConnect(callback?: () => unknown) {
    let interval: number | undefined;
    const onDisconnect = () => {
      if (this.isLeave) {
        return;
      }
      this.isReadySignal.value = false;
      interval = window.setInterval(() => {
        this.socket.connect();
      }, 1000);
    };

    this.socket.on('disconnect', onDisconnect);

    this.socket.on('connect', async () => {
      clearInterval(interval);
      this.isReadySignal.value = true;
      callback?.();
    });
  }

  async init(): Promise<Api> {
    const url = this.config.getServerUrl();
    this.socket = io(url, { transports: ['websocket'] });

    return new Promise((resolve, reject) => {
      if (this.isReadySignal.peek()) {
        resolve(this);
        return;
      }
      this.socket.once('connect', () => {
        this.isReadySignal.value = true;
        resolve(this);
      });
      this.socket.once('connect_error', reject);
    });
  }

  async login({}: GuestLoginInput): Promise<GuestLoginOutput> {
    if (!this.isReadySignal.value) {
      throw new Error('Api is not ready');
    }
    return await this.socket.emitWithAck(EventType.GUEST_LOGIN, {});
  }

  joinRoom(roomId: string) {
    // TODO add path
    this.emit(EventType.ROOM_JOIN, { roomId });
  }

  updateMyInfo(myInfo: UpdateMyInfoInput) {
    this.emit(EventType.UPDATE_MY_INFO, myInfo);
  }

  async getUserList({ roomId }: RoomUserListInput): Promise<RoomUserListOutput> {
    if (!this.isReadySignal.peek()) {
      throw new Error('Api is not ready');
    }
    const output: RoomUserListOutput = await this.socket.emitWithAck(EventType.ROOM_USER_LIST, {
      roomId,
    });
    this.usersStorage.setUsers(output.users);
    return output;
  }

  leave({ roomId }: RoomLeaveInput) {
    this.isLeave = true;
    this.emit(EventType.ROOM_LEAVE, { roomId });
    this.socket.close();
  }

  listen(event: string, callback: (...args: any[]) => unknown) {
    if (!this.isReadySignal.peek()) {
      throw new Error('Api is not ready');
    }
    this.socket.on(event, callback);
  }

  emit(event: string, payload: any) {
    if (!this.isReadySignal.peek()) {
      console.error('Api is not ready');
    }
    this.socket.emit(event, payload);
  }
}

export default Api;
