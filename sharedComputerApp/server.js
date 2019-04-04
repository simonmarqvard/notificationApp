const express = require("express");
const server = express();
const http = require("http");
const socket = require("socket.io");

server.use("/", express.static("renderer"));

let httpServer = http.createServer(server);

var io = socket(httpServer);

let members = 0;

httpServer.listen(8080, () => {
  console.log("listening on 8080");
});

io.sockets.on("connection", socket => {
  console.log("we have a connection: " + socket.id);
  members++;
  console.log(members);
});
