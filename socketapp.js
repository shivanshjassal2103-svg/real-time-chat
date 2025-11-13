import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && name.trim()) {
      const time = new Date().toLocaleTimeString();
      const data = { name, message, time };
      socket.emit('sendMessage', data);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />

      <div className="chat-box">
        {chat.map((msg, index) => (
          <p key={index}>
            <strong>{msg.name}</strong> [{msg.time}]: {msg.message}
          </p>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
