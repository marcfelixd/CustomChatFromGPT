// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const port = 4000;
// const app = express();
// app.use(cors()); 
// const server = http.createServer(app);
// const io = socketIo(server);

// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("chat message", (msg) => {
//     console.log(`Message received: ${msg.text}`);
//     io.emit("chat message", msg); // echo the message back
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// server.listen(port, () => console.log(`Server running on port ${port}`));


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const port = 4000;
const app = express();

app.use(cors()); // Utilisation du middleware CORS

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Permettre à toutes les origines d'accéder à votre serveur
    methods: ["GET", "POST"] // Les méthodes que vous souhaitez autoriser
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("chat message", (msg) => {
    console.log(`Message received: ${msg.text}`);
    io.emit("chat message", msg); // echo the message back
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
