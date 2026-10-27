// require mariadb connector
const mariadb = require("mariadb");

// create Pool for mariaDB connection
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// export pool
exports.pool = pool;

