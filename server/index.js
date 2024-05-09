const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser"); // Add this line for parsing POST requests

app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON bodies

const server = http.createServer(app);
const io = new Server(server, {
  cors: {},
});

let messageList = []; // Maintain a list of messages

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// New endpoint to send a message
app.post("/send_message", (req, res) => {
  const { room, author, message, time } = req.body;
  const messageData = { room, author, message, time };
  
  io.to(room).emit("receive_message", messageData); // Emit message to room
  messageList.push(messageData); // Add message to messageList
  
  res.status(200).json({ success: true, message: "Message sent successfully" });
});

// New endpoint to get all messages
app.get("/messages", (req, res) => {
  res.status(200).json({ success: true, messages: messageList });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
