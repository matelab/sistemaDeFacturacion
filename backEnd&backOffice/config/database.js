const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASENAME,
    host: process.env.DATABASE_HOST,
    options: {
      timezone: '+/-HH:MM',
      instanceName: 'SQLEXPRESS'
    },
    logging: true,
    pool: {
      max: 50,
      min: 1,
      idle: 30000
    },
    dialectOptions: {
      useUTC: false,
      encrypt: true,
      requestTimeout: 30000
    },
    dialect: 'mssql'
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:'
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASENAME,
    host: process.env.DATABASE_HOST,
    options: {
      timezone: '+/-HH:MM',
      instanceName: 'SQLEXPRESS'
    },
    logging: false,
    pool: {
      max: 50,
      min: 1,
      idle: 30000
    },
    dialectOptions: {
      useUTC: false,
      encrypt: true,
      requestTimeout: 30000
    },
    dialect: 'mssql'
  }
};

module.exports = config[env];
