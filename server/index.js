const { Server } = require("socket.io");
const { createServer } = require("http");

// Create an Express app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

// Create a HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Event listener for joining a room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Event listener for sending a message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Event listener for disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Export the server for Vercel deployment
module.exports = (req, res) => {
  // Handle incoming HTTP requests
  app(req, res);
};
