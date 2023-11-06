import 'reflect-metadata';
import fastify from 'fastify';
import cors from '@fastify/cors';
import mercurius from 'mercurius';
import fastifySocketIO from 'fastify-socket.io';
import { buildSchema } from 'type-graphql';
import { MemberResolver } from './infrastructure/member.resolver';
import { Server } from 'socket.io';
import { User, RoomLeaveOutput, EventType } from '@packages/api';
import { Logger } from '@packages/logger';
import { onChatMessage } from './events/chat-message';
import { onGuestLogin } from './events/guest-login';
import { onPointerClick } from './events/pointer-click';
import { onPointerMove } from './events/pointer-move';
import { onRoomJoin } from './events/room-join';
import { onRoomLeave } from './events/room-leave';
import { onRoomUserList } from './events/room-user-list';
import { onUpdateMyInfo } from './events/update-my-info';
import path from 'path';
import fs from 'fs';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

async function main(): Promise<void> {
  const server = fastify();
  await server.register(cors);
  await server.register(mercurius, {
    graphiql: true,
    schema: await buildSchema({
      emitSchemaFile: './schema.gql',
      resolvers: [MemberResolver],
      validate: false,
    }),
  });
  await server.register(fastifySocketIO);

  server.get('/sdk.es.js', async (_req, res) => {
    const sdkPath = path.resolve(__dirname, '..', '..', '..', 'apps', 'sdk', 'dist', '@ensemble-js', 'sdk.es.js');
    const data = await fs.promises.readFile(sdkPath);
    res.type('text/javascript').send(data);
  });

  await server.listen({ port: 8080, host: '0.0.0.0' });
  await server.ready();
  Logger.log(`GraphiQL http://localhost:8080/graphiql`);
  server.io.on('connection', (socket) => {
    Logger.log(`Client connected: ${socket.id}`);

    onGuestLogin(server.io, socket);
    onChatMessage(server.io, socket);
    onPointerClick(server.io, socket);
    onPointerMove(server.io, socket);
    onRoomJoin(server.io, socket);
    onRoomLeave(server.io, socket);
    onRoomUserList(server.io, socket);
    onUpdateMyInfo(server.io, socket);

    socket.on('disconnect', () => {
      // 로그인 된 소켓일때만, 나간 유저에 대한 정보를 모든 유저에게 전송함.
      if (socket.data.user) {
        const user: User = socket.data.user;
        const output: RoomLeaveOutput = { success: true, userId: user.id };
        server.io.emit(EventType.ROOM_LEAVE, output);
      }
      Logger.log(`Client disconnected: ${socket.id}`);
    });
  });
}

main();
