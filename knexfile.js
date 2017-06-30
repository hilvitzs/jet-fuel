module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel_test',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    },
    useNullAsDefault: true
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: '/db/migrations'
    },
    seeds: {
      directory: '/db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
  client: 'pg',
  connection: process.env.DATABASE_URL + `?ssl=true`,
  migrations: {
    directory: './db/migrations'
  },
  useNullAsDefault: true
}
};
