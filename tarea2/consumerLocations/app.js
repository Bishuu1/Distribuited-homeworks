"use strict";
/* IMPORTS */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

const { Pool, Client } = require("pg");
const app = express();
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8001;
var host = process.env.PORT || "0.0.0.0";

//kafka Consumer
var kafka = new Kafka({
  clientId: "memberapp",
  brokers: ["kakfa:9092"],
});

const consumer = kafka.consumer({ groupId: "locationGroup" });

var value = null;

//Postgres Credentials//
const credentials = {
  user: "root",
  host: "localhost",
  database: "root",
  password: "",
  port: 5432,
};

//Postgres Credentials
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "root",
  password: "",
  port: 5432,
});

//Register function
const main = async () => {
  console.log("Entra main");
  await consumer.connect();
  await consumer.subscribe({ topic: "location", fromBeginning: true });
  console.log("location");

  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        value = message.value;
        console.log({
          value: message.value.toString(),
        });
        json = JSON.parse(value);
        updateCoordinates(json);
      },
    })
    .catch(console.error);
};

async function updateCoordinates(coordinates) {
  const text = `
    UPDATE location
    SET patente=$1, x=$2, y=$3
    WHERE id=$4
  `;

  const values = [
    JSON.stringify(coordinates.x),
    JSON.stringify(coordinates.y),
    JSON.stringify(coordinates.id),
  ];

  console.log("starting async query");

  const result = await pool.query(text, values);

  return result;
}

//Consumer consuming
await consumer.connect();
await consumer.subscribe({ topic: "location", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (partition == 1) {
      updateCoordinates(message);
    } else {
      console.log("No se ha podido actualizar la ubicación");
    }
    console.log({
      value: message.value.toString(),
    });
  },
});
