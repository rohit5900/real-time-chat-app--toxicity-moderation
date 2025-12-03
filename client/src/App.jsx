import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { socket } from './socket';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AppContent() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = (user, roomName) => {
    setUsername(user);
    setRoom(roomName);
    socket.auth = { username: user };
    socket.connect();
    socket.emit('join_room', roomName);
    navigate('/chat');
  };

  return (
    <AppContainer>
      <Routes>
        <Route 
          path="/" 
          element={<Login onJoin={handleLogin} />} 
        />
        <Route 
          path="/chat" 
          element={
            <ChatRoom 
              username={username} 
              room={room} 
            />
          } 
        />
      </Routes>
    </AppContainer>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
