//basic api with kafka
const express = require("express");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");
const { Partitioners } = require('kafkajs')

//const dotenv = require("dotenv");
//const port = 3000;
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
const producer = kafka.producer()

const admin = kafka.admin()

    
admin.connect()
    // await producer.connect()
admin.createTopics({
      waitForLeaders: true,
      topics: [
        { topic: 'members',
          numPartitions: 2, 
          replicationFactor: 1, 
      },
      ],
})


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
var host = process.env.PORT || '0.0.0.0';
///////////////////////////////////////////////////////////////


app.post("/submit", (req, res) => {
  console.log("submit");
  (async () => {
    console.log("hola");
    await producer.connect();
    console.log("hola2");
    const { name, premium} = req.body;
    if (premium == true) {
      await producer.send({
        topic: "members",
        messages: [
          { key: 'name', value: "premium", partition: 1 },
        ],
      });
    } else {
      await producer.send({
        topic: "members",
        messages: [
          { key: 'name', value: "non-premium", partition: 0 },
        ],
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
      messages: [{ value: JSON.stringify(location)}],
      partition: 1,
    });
    await producer.send({
      topic: "stock",
      messages: [{ value: JSON.stringify(stock)}],
      partition: 1,
    });

    await producer.disconnect();
  })();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
