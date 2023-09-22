import { io, Socket } from 'socket.io-client';

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

  join({ roomId }: { roomId: string }) {
    this.socket.emit('join', { roomId });
  }

  leave({ roomId }: { roomId: string }) {
    this.socket.emit('leave', { roomId });
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
