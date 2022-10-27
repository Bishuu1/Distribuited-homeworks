const consumer = kafka.consumer({ groupId: "location-group" });

await consumer.connect();
await consumer.subscribe({ topic: "location", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value.toString(),
    });
  },
});
