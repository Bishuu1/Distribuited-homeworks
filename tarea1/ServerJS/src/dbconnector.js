const { Pool } = require("pg");

const connectionData = {
  user: "root",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432,
};

const client = new Pool(connectionData);

module.exports = { client };
