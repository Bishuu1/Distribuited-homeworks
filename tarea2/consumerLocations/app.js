const { Pool, Client } = require("pg");

//kafka Consumer
var kafka = require("kafka-node");
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
var consumer = new Consumer(
  client,
  {
    groupId: "location-group",
  },
  [
    { topic: "location", partition: 0 },
    { topic: "location", partition: 1 },
  ],
  {
    autoCommit: false,
  }
);

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
async function updateCoordinates(coordinates) {
  const text = `
    UPDATE location
    SET x=$1, y=$2 
    WHERE id=$3
  `;

  const values = [coordinates.x, coordinates.y, coordinates.id];

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
    }
    console.log({
      value: message.value.toString(),
    });
  },
});
