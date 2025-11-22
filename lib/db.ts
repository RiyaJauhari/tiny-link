import { Pool } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

let pool: Pool;

if (!global._pgPool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, 
    },
  });

  global._pgPool = pool;
} else {
  pool = global._pgPool;
}

export default pool;
