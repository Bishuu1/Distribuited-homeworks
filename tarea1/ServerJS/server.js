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
<<<<<<< HEAD

=======
    console.log("aber");
>>>>>>> 4ac790235b6dec72e85935908d3a863664af8831
    client.connect((err, client, release) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
<<<<<<< HEAD
      client.query(
        'SELECT * FROM public."Users" WHERE id = $1',
        [id],
        (error, results) => {
=======
      console.log("Client connected");
      client.query(
        "SELECT * FROM public.dburl WHERE id = $1",
        [id],
        (error, result) => {
>>>>>>> 4ac790235b6dec72e85935908d3a863664af8831
          release();
          if (error) {
            throw error;
          }
<<<<<<< HEAD
          response.status(200).json(results.rows);
=======
          callback(null, { product: result.rows });
>>>>>>> 4ac790235b6dec72e85935908d3a863664af8831
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
