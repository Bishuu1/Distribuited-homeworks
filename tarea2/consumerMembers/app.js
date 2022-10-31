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
const consumer = kafka.consumer({ groupId: "membersGroup" });

var value = null;

function writeToFile(data, texto) {
  fs.appendFile(texto, data, (err) => {
    if (err) throw err;
    console.log("The " + data + " was appended to file!");
  });
}

const main = async () => {
  console.log("Entra main");
  await consumer.connect();
  await consumer.subscribe({ topic: "members", fromBeginning: true });
  console.log("members");

  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        value = message.value;

        if (partition == 1) {
          writeToFile(message.value.toString(), "registers.txt");
        } else {
          writeToFile(message.value.toString(), "escapees.txt");
        }
        console.log({
          value: message.value.toString(),
        });
      },
    })
    .catch(console.error);
};

/* PORTS */

app.get("/members", (req, res) => {
  res.send("hola");
});

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});
