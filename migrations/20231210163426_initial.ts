import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary();
		table.string('username').notNullable();
		table.string('first_name');
		table.string('surname');
		table.string('e-mail').notNullable();
		table.string('password').notNullable();
		table.integer('ranking').defaultTo(200);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.timestamp('deleted_at');
	})

	await knex.schema.createTable('games', (table) => {
		table.uuid('id').primary();
		table.uuid('white_user_id').references('id').inTable('users').notNullable();
		table.integer('white_user_ranking').notNullable()
		table.uuid('black_user_id').references('id').inTable('users').notNullable();
		table.integer('black_user_ranking').notNullable()
		table.enu('result', [0, 1, 2]).nullable(); // 0 - draw / 1 - first player won / 2 - second player won
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.timestamp('deleted_at');
	})

	await knex.schema.createTable('moves', (table) => {
		table.uuid('game_id').references('id').inTable('games').notNullable();
		table.uuid('player_id').references('id').inTable('users').notNullable();
		table.jsonb('starting_piece_coordinates').notNullable();
		table.jsonb('final_piece_coordinates').nullable();
		table.enu('piece_type', ['pawn', 'bishop', 'knight', 'rook', 'queen', 'king']).notNullable();
		table.boolean('is_captured').defaultTo(0);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.timestamp('deleted_at');
	})

	await knex.schema.createTable('messages', (table) => {
		table.uuid('sender_id').references('id').inTable('users').notNullable();
		table.uuid('recipient_id').references('id').inTable('users').notNullable();
		table.string('message', 500).notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
		table.timestamp('deleted_at');
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('moves');
	await knex.schema.dropTable('messages');
	await knex.schema.dropTable('games');
	await knex.schema.dropTable('users');
}

