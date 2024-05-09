import React, { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import VideoChat from "./VideoChat";
import "./App.css"
import "./VideoChat.css"

const socket = io.connect("https://chat-app-3-5chz.onrender.com");

function App({ sound }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showVideoChat, setShowVideoChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const startVideoChat = () => {
    if (username !== "" && room !== "") {
      setShowVideoChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat && !showVideoChat && (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Navvy..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          <button onClick={startVideoChat}>Start Video Chat</button>
        </div>
      )}
      {showChat && (
        <Chat socket={socket} username={username} room={room} sound={sound} />
      )}
      {showVideoChat && (
        <VideoChat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;