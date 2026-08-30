const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "finpilot",
    password: "PostgreSql@06",
    port: 5432
});

module.exports = pool;