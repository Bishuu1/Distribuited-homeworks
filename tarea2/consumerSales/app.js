"use strict";
/* IMPORTS */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

//-------------------------------------------

/* CONFIGS */
//server.server();
const app = express();
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8000;
var host = process.env.PORT || "0.0.0.0";

var kafka = new Kafka({
  clientId: "memberapp",
  brokers: ["kakfa:9092"],
});
const consumer = kafka.consumer({ groupId: "salesGroup" });

var value = null;

const main = async () => {
  console.log("Entra main");
  await consumer.connect();
  await consumer.subscribe({ topic: "sales", fromBeginning: true });
  console.log("sales");

  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        value = message.value;
        json = JSON.parse(value);
      },
    })

    .catch(console.error);
};

/* PORTS */

app.get("/sales", (req, res) => {
  res.send("hola");
});

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});
