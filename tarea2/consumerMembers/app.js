const { Pool, Client } = require("pg");

//kafka Consumer
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "my-group" });

var client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

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
async function registerMember(member) {
  const text = `
    INSERT INTO members (name, lastname, rut, email, patent, premium)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const values = [
    member.name,
    member.lastname,
    member.rut,
    member.email,
    member.patent,
    member.premium,
  ];
  console.log("starting async query");
  const result = await pool.query(text, values);
  return result;
}

//Consumer consuming
await consumer.connect();
await consumer.subscribe({ topic: "members", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (partition == 1) {
      registerMember(message);
    }
    console.log({
      value: message.value.toString(),
    });
  },
});
