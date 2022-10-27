//basic api with kafka
const express = require("express");
const kafka = require("kafka-node");
const app = express();
const port = 3000;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

var Producer = kafka.Producer(client);

app.post("/submit", (req, res) => {
  Producer.on("ready", function () {
    if (req.body.premium == true) {
      var payloads = [{ topic: "members", messages: req.body, partition: 1 }];
    } else {
      var payloads = [{ topic: "members", messages: req.body, partition: 0 }];
    }
    Producer.send(payloads, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

//post request basic to send data to kafka
app.post("/ventas", (req, res) => {
  Producer.on("ready", function () {
    var payloads = [{ topic: "sales", messages: req.body, partition: 0 }];
    Producer.send(payloads, function (err) {
      console.log(err);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
