import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

const socket = io("http://localhost:4000");

function OnlineLanding() {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, []);

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && currentMessage.trim() !== "") {
      socket.emit("message", { room: roomId, message: currentMessage });
      setCurrentMessage("");
    }
  };

  return (
    <>
      <Nav />
      {!roomId ? (
        <form onSubmit={handleRoomSubmit}>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
          />
          <button type="submit">Join Room</button>
        </form>
      ) : (
        <div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <Footer />
    </>
  );
}

export default OnlineLanding;
