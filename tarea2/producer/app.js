//basic api with kafka
const express = require("express");
const { Kafka } = require("kafkajs");
const app = express();
const port = 3000;
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

app.post("/submit", (req, res) => {
  console.log("submit");
  (async () => {
    const producer = kafka.producer();
    await producer.connect();
    if (req.body.premium == true) {
      await producer.send({
        topic: "members",
        messages: req.body,
        partition: 1,
      });
    } else {
      await producer.send({
        topic: "members",
        messages: req.body,
        partition: 0,
      });
    }
    await producer.disconnect();
  })();
});

//post request basic to send data to kafka
//post ventas should send sales and clients to topic=sales, location should be sent to topic=location and stock should be sent to topic=stock.
app.post("/ventas", (req, res) => {
  console.log("submit");
  (async () => {
    const producer = kafka.producer();
    await producer.connect();
    const { name, sales, clients, time, stock, location } = req.body;
    let sale = {
      name: name,
      sales: sales,
      clients: clients,
    };
    await producer.send({
      topic: "sales",
      messages: [{ value: JSON.stringify(sale) }],
      partition: 1,
    });

    await producer.send({
      topic: "location",
      messages: location,
      partition: 1,
    });
    await producer.send({
      topic: "stock",
      messages: stock,
      partition: 1,
    });

    await producer.disconnect();
  })();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
