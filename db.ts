let knexfile = require('./knexfile')


const db = require('knex')(knexfile['development']);
