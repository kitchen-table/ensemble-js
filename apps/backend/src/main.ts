import 'reflect-metadata';
import fastify from 'fastify';
import cors from '@fastify/cors';
import mercurius from 'mercurius';
import fastifySocketIO from 'fastify-socket.io';
import { NoSchemaIntrospectionCustomRule } from 'graphql';
import { buildSchema } from 'type-graphql';
import { MemberResolver } from './member/member.resolver';
import { Server } from 'socket.io';
import { Logger } from '@packages/logger';
import { Connection } from './socket/connection';
import { sdkController } from './sdk/sdk.controller';
import { Env } from './env';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

async function main(): Promise<void> {
  const server = fastify();
  await server.register(cors);
  await server.register(fastifySocketIO);

  // GraphQL
  await server.register(mercurius, {
    graphiql: Env.graphqlPlaygroundEnabled,
    validationRules: Env.graphqlPlaygroundEnabled ? [] : [NoSchemaIntrospectionCustomRule],
    schema: await buildSchema({
      emitSchemaFile: './schema.gql',
      resolvers: [MemberResolver],
      validate: false,
    }),
  });

  // REST API
  sdkController(server);

  // Socket.IO
  server.io.on('connection', (socket) => Connection.init(server.io, socket));

  await server.listen({ port: 8080, host: '0.0.0.0' });
  await server.ready();

  Logger.log(`GraphiQL http://localhost:8080/graphiql`);
}

main();
