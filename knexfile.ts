import type { Knex } from "knex";
require('dotenv').config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgres',
		connection: {
			host : process.env.db_host,
			port : parseInt(process.env.db_port),
			user : process.env.db_user,
			password : process.env.db_password,
			database : process.env.db_database
		},
		migrations: {
      tableName: "migrations"
    }
  },
};

module.exports = config;
