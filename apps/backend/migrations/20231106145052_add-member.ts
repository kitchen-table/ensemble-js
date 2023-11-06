import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('members', (table) => {
    table.increments('id').primary();
    table.string('email', 255);
    table.string('name', 70); // Reference: https://stackoverflow.com/questions/30485/what-is-a-reasonable-length-limit-on-person-name-fields
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('members');
}
