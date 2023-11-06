import { Env } from './env';

module.exports = {
  client: 'mysql2',
  connection: {
    host: Env.MYSQL_HOST,
    port: Env.MYSQL_PORT,
    user: Env.MYSQL_USER,
    password: Env.MYSQL_PASSWORD,
    database: Env.MYSQL_DATABASE,
    pool: { min: 0, max: 10 },
  },
  migrations: {
    directory: '../migrations',
  },
};
