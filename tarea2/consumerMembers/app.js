const pg = require("pg");
var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient(),
  consumer = new Consumer(
    client,
    [
      { topic: "t", partition: 0 },
      { topic: "t1", partition: 1 },
    ],
    {
      autoCommit: false,
    }
  );
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = kafka.consumer(client, { groupId: "members-group" });
const credentials = {
  user: "root",
  host: "localhost",
  database: "root",
  password: "",
  port: 5432,
};

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
  return pool.query(text, values);
}

await consumer.connect();
await consumer.subscribe({ topic: "members", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (partition == 1) {
    }
    console.log({
      value: message.value.toString(),
    });
  },
});
