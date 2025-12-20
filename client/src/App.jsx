import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import ChatRoom from './components/ChatRoom';
import { socket } from './socket';
import { ThemeContext, useTheme, lightTheme, darkTheme } from './ThemeContext';



const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${props => props.theme.bg};
    color: ${props => props.theme.text};
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
  }
`;

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    // Check token on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: Verify token with backend or decode it to get username
      // For now, if we have a token but no username in state, we might need to recover it or force re-login.
      // Simpler for MVP: If no username state, redirect to login to be safe, or decode token.
      // Let's just rely on the Login component to set state for now.
    }
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = (user, roomName) => {
    setUsername(user);
    setRoom(roomName);
    socket.auth = { username: user };
    socket.connect();
    navigate('/chat');
  };

  return (
    <AppContainer>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button onClick={toggleTheme} style={{
          background: 'none', 
          border: '1px solid ' + (isDark ? '#fff' : '#333'), 
          color: isDark ? '#fff' : '#333',
          padding: '5px 10px',
          borderRadius: '20px',
          cursor: 'pointer'
        }}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={<Login onJoin={handleLogin} />} 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatRoom 
                username={username} 
                room={room} 
              />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AppContainer>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
