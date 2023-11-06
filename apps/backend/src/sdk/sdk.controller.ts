import { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';

export function sdkController(server: FastifyInstance) {
  server.get('/sdk.es.js', async (_req, res) => {
    const sdkPath = path.resolve(__dirname, '..', '..', '..', '..', 'apps', 'sdk', 'dist', '@ensemble-js', 'sdk.es.js');
    const data = await fs.promises.readFile(sdkPath);
    res.type('text/javascript').send(data);
  });
}
