import knex from 'knex';
import * as knexConfig from './knexfile';

export const db = knex(knexConfig);
