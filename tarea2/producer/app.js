//basic api with kafka
const express = require("express");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");
const { Partitioners } = require("kafkajs");

//const dotenv = require("dotenv");
//const port = 3000;
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});
kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const producer = kafka.producer();

const admin = kafka.admin();

admin.connect();
// await producer.connect()
admin.createTopics({
  waitForLeaders: true,
  topics: [
    { topic: "members", numPartitions: 2, replicationFactor: 1 },
    { topic: "stock", numPartitions: 2, replicationFactor: 1 },
    { topic: "sales", numPartitions: 2, replicationFactor: 1 },
    { topic: "location", numPartitions: 2, replicationFactor: 1 },
  ],
});

// const admin = kafka.admin()
// await admin.connect()

// await admin.listTopics()

// const membersTopic ={
//   topic: 'members',
//   numPartitions: 2,     // default: -1 (uses broker `num.partitions` configuration)
//   replicationFactor: 3, // default: -1 (uses broker `default.replication.factor` configuration)
// }

// await admin.createTopics({
//   validateOnly: false,
//   waitForLeaders: true,
//   topics: membersTopic,
// })

//server.server();
const app = express();
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use(bodyParser.json());
//app.use(cors());

var port = process.env.PORT || 3000;
var host = process.env.PORT || "0.0.0.0";
///////////////////////////////////////////////////////////////

app.post("/submit", (req, res) => {
  console.log("submit");
  (async () => {
    await producer.connect();
    var user = {
      name: req.body.name,
      lastname: req.body.lastname,
      rut: req.body.rut,
      email: req.body.email,
      patente: req.body.patente,
      premium: req.body.premium,
    };
    if (premium == true) {
      await producer.send({
        topic: "members",
        messages: [{ value: JSON.stringify(user), partition: 1 }],
      });
    } else {
      await producer.send({
        topic: "members",
        messages: [{ value: JSON.stringify(user), partition: 0 }],
      });
    }
    await producer.disconnect();
  })();
});

//post request basic to send data to kafka
//post ventas should send sales and clients to topic=sales, location should be sent to topic=location and stock should be sent to topic=stock.
app.post("/ventas", (req, res) => {
  const numero = Math.floor(Math.random() * 10);
  console.log("submit");
  var time = Math.floor(new Date() / 1000);
  (async () => {
    const producer = kafka.producer();
    await producer.connect();
    let sale = {
      patente: req.body.patente,
      sales: req.body.sales,
      clients: clients,
    };
    let location = {
      patente: req.body.patente,
      coordinateX: req.body.coordinateX,
      coordinateY: req.body.coordinateY,
      time: time,
    };
    let stock = {
      patente: req.body.patente,
      stock: req.body.stock,
    };

    //ordenamos aleatoriamente los datos en la particion 1 o 0 para las ventas y el stock
    if (numero % 2 == 0) {
      await producer.send({
        topic: "sales",
        messages: [{ value: JSON.stringify(sale) }],
        partition: 1,
      });
      await producer.send({
        topic: "stock",
        messages: [{ value: JSON.stringify(stock) }],
        partition: 1,
      });
    } else {
      await producer.send({
        topic: "sales",
        messages: [{ value: JSON.stringify(sale) }],
        partition: 0,
      });
      await producer.send({
        topic: "stock",
        messages: [{ value: JSON.stringify(stock) }],
        partition: 0,
      });
    }
    //se envia la localizacion a la particion 0
    await producer.send({
      topic: "location",
      messages: [{ value: JSON.stringify(location) }],
      partition: 0,
    });
    await producer.disconnect();
  })();
});

app.post("/report", (req, res) => {
  console.log("submit");
  (async () => {
    await producer.connect();
    var location = {
      patente: req.body.patente,
      coordinateX: req.body.coordinateX,
      coordinateY: req.body.coordinateY,
      time: time,
    };
    //se envia el reporte al topico location particion 1
    await producer.send({
      topic: "location",
      messages: [{ value: JSON.stringify(location) }],
      partition: 1,
    });
    await producer.disconnect();
  })();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
