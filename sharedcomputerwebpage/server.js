const express = require("express");
const server = express();
const http = require("http");
const socket = require("socket.io");

server.use("/", express.static("public"));

let httpServer = http.createServer(server);

var io = socket(httpServer);

let members = 0;

let electronUser = null;

httpServer.listen(8080, () => {
  console.log("listening on 8080");
});

io.sockets.on("connection", socket => {
  console.log("we have a connection: " + socket.id);
  members++;
  console.log(electronUser);
  if (electronUser) {
    io.emit("electronUserOnline");
  }
  console.log(members);

  socket.on("notice", () => {
    console.log("notice");
    socket.broadcast.emit("notice");
  });

  socket.on("noticeResponse", response => {
    console.log(response);
    socket.broadcast.emit("noticeResponse", response);
  });

  socket.on("screensaver", () => {
    console.log("screensave");
    socket.broadcast.emit("screensave");
  });

  socket.on("turnoff", () => {
    console.log("turnoff");
    socket.broadcast.emit("turnoff");
  });

  socket.on("electronUserOnline", () => {
    socket.broadcast.emit("electronUserOnline");
    electronUser = socket.id;
  });

  socket.on("disconnect", user => {
    console.log("user disconnected");
    if (socket.id == electronUser) {
      socket.broadcast.emit("electronUserOffline");
      electronUser = null;
    }
    members--;
    console.log(members);
  });
});
