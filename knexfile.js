module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel_test',
    migrations: {
      directory: '/db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
