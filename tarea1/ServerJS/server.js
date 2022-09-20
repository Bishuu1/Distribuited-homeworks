const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./websearch.proto";
var protoLoader = require("@grpc/proto-loader");
const { client } = require("./src/dbconnector");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const a = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(a.WebsiteSearch.service, {
  GetServerResponse: (call, callback) => {
    const id = call.request.message;

    client.connect((err, client, release) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
      client.query(
        'SELECT * FROM public."Users" WHERE id = $1',
        [id],
        (error, results) => {
          release();
          if (error) {
            throw error;
          }
          response.status(200).json(results.rows);
        }
      );
    });
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);
