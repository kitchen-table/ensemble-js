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

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  Logger.log(`Client connected: ${socket.id}`);

  onChatMessage(io, socket);
  onPointerClick(io, socket);
  onPointerMove(io, socket);
  onRoomJoin(io, socket);
  onRoomLeave(io, socket);
  onRoomUserList(io, socket);
  onUpdateMyInfo(io, socket);

  socket.on('join', (data: { roomId: string }) => {
    socket.join(data.roomId);
    Logger.log(`Client ${socket.id} joined room ${data.roomId}`);
  });

  socket.on('leave', (data: { roomId: string }) => {
    socket.leave(data.roomId);
    Logger.log(`Client ${socket.id} left room ${data.roomId}`);
  });

  socket.on('move', (data: { element: string; x: number; y: number }) => {
    socket.emit('move', { ...data, sender: socket.id });
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit('move', { ...data, sender: socket.id });
    });
    Logger.log(`Client ${socket.id} moved mouse to ${data.x}, ${data.y}`);
  });

  socket.on('disconnect', () => {
    Logger.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  Logger.log('Listening on port 3000');
});
