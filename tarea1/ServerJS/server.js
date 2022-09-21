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
    console.log("aber");
    client.connect((err, client, release) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
      console.log("Client connected");
      client.query(
        "SELECT * FROM public.dburl WHERE id = $1",
        [id],
        (error, result) => {
          release();
          if (error) {
            throw error;
          }
          callback(null, { product: result.rows });
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
