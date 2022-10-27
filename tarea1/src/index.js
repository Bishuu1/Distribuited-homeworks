//Inicializacion API
const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const { Pool } = require("pg");

//dbconnect
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "postgres",
  port: 5432,
});

//Server
const port = 3000;
//app.use(bodyParser.json());

//Rutas
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/search?:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  pool.query(
    'SELECT * FROM public."Users" WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

app.listen(port, () => {
  console.log("Server running on port 3000");
});
