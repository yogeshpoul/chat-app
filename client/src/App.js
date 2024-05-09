import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios"; // Import axios for making HTTP requests

function Chat({ username, room, sound }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      try {
        await axios.post("https://chat-app-swart-psi.vercel.app/send_message", messageData);
        setCurrentMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("https://chat-app-swart-psi.vercel.app/messages");
        setMessageList(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
      sound.play();
    };

    // Set up event listener for new messages
    const interval = setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds
    return () => clearInterval(interval); // Cleanup function to clear interval

  }, [sound]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
