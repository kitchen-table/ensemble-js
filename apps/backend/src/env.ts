import { EnvKey, EnvSafe } from '@creatrip/env-safe';

@EnvSafe({ path: '../.env' })
export class Env {
  @EnvKey({ default: '127.0.0.1' })
  static readonly MYSQL_HOST: string;

  @EnvKey({ default: 3306 })
  static readonly MYSQL_PORT: number;

  @EnvKey({ default: 'root' })
  static readonly MYSQL_USER: string;

  @EnvKey({ default: '123qwe' })
  static readonly MYSQL_PASSWORD: string;

  @EnvKey({ default: 'ensemblejs' })
  static readonly MYSQL_DATABASE: string;
}
