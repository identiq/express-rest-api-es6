import pg from 'pg';

export default callback => {

  let config = {
    user: 'popchefpostgre',
    database: 'popchefpostgre',
    password: 'popchefpostgre',
    host: 'popchefpostgre.ctpnyikidjdj.eu-central-1.rds.amazonaws.com',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
  };

  const pool = new pg.Pool(config);

	callback(pool);
}

