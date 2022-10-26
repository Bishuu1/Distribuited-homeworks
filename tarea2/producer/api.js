//basic api with kafka
const express = require("express");
const kafka = require("kafka-node");
const app = express();
const port = 3000;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

var Producer = kafka.Producer(client);

app.get("/", (req, res) => {
  Producer.on("ready", function () {
    var payloads = [{ topic: "test", messages: "hi", partition: 0 }];
    Producer.send(payloads, function (err, data) {
      console.log(data);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
