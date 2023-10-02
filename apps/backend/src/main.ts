import { createServer } from 'http';
import { Server } from 'socket.io';
import { Logger } from '@packages/logger';
import { onChatMessage } from './events/chat-message';
import { onPointerClick } from './events/pointer-click';
import { onPointerMove } from './events/pointer-move';
import { onRoomJoin } from './events/room-join';
import { onRoomLeave } from './events/room-leave';
import { onRoomUserList } from './events/room-user-list';
import { onUpdateMyInfo } from './events/update-my-info';
import { onGuestLogin } from './events/guest-login';
import { EventType, RoomLeaveOutput, User } from '@packages/api';
import * as fs from 'fs';
import * as path from 'path';

const httpServer = createServer((req, res) => {
  // TODO temporary serving solution
  if (req.url === '/sdk.es.js') {
    const sdkPath = path.resolve('..', 'js-sdk', 'dist', '@kitchen-table', 'js-sdk.es.js');
    fs.readFile(sdkPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/javascript', 'Access-Control-Allow-Origin': '*' });
      res.write(data);
      res.end();
    });
  }
});

const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
  Logger.log(`Client connected: ${socket.id}`);

  onGuestLogin(io, socket);
  onChatMessage(io, socket);
  onPointerClick(io, socket);
  onPointerMove(io, socket);
  onRoomJoin(io, socket);
  onRoomLeave(io, socket);
  onRoomUserList(io, socket);
  onUpdateMyInfo(io, socket);

  socket.on('disconnect', () => {
    // 로그인 된 소켓일때만, 나간 유저에 대한 정보를 모든 유저에게 전송함.
    if (socket.data.user) {
      const user: User = socket.data.user;
      const output: RoomLeaveOutput = { success: true, userId: user.id };
      io.emit(EventType.ROOM_LEAVE, output);
    }
    Logger.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => Logger.log(`Listening on port ${PORT}`));
