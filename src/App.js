import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (loggedIn) {
      fetchMessages();
    }
  }, [loggedIn]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', 
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.message === 'Login successful') {
        setLoggedIn(true);
        setError(''); 
      } else {
        setError('Please use correct username or password'); 
      }
    } catch (error) {
      setError('Please use correct username or password'); 
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleSendMessage = async () => {
    try {
      await axios.post('http://localhost:5001/api/messages/send', { sender: username, text: message }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/messages/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="login">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </div>
      ) : (
        <div className="chat">
          <h2>Chat</h2>
          <div>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <div>
            <h3>Message History</h3>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
