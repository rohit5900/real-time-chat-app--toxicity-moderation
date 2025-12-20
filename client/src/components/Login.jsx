import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LoginCard = styled.div`
  background: ${props => props.theme.cardBg};
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid ${props => props.theme.cardBorder};
  width: 400px;
  text-align: center;
  color: ${props => props.theme.text};
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.cardBorder};
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.accent : props.theme.text};
  border-bottom: 2px solid ${props => props.$active ? props.theme.accent : 'transparent'};
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  opacity: ${props => props.$active ? 1 : 0.6};

  &:hover {
    color: ${props => props.theme.accent};
    opacity: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.text};
    opacity: 0.6;
  }

  &:focus {
    background: ${props => props.theme.cardBorder};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #4ecca3;
  color: #1a1a2e;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 10px;

  &:hover {
    transform: scale(1.02);
    background: #45b393;
  }
`;

const GoogleButton = styled(Button)`
  background: #fff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: #f1f1f1;
  }
`;

const ErrorMsg = styled.div`
  color: #ff4757;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

export default function Login({ onJoin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const url = `${import.meta.env.VITE_SOCKET_URL}${endpoint}`;

    try {
      const res = await axios.post(url, formData);
      if (isLogin) {
        // Login success
        const { token, username } = res.data;
        localStorage.setItem('token', token);
        onJoin(username, 'General'); // Default room
      } else {
        // Register success -> Switch to login
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, this would redirect to the backend Google auth route
    // window.location.href = 'http://localhost:3000/api/auth/google';
    alert("Google Auth requires Client ID/Secret configuration in backend.");
  };

  return (
    <LoginCard>
      <Title>Welcome</Title>
      
      <TabContainer>
        <Tab $active={isLogin} onClick={() => setIsLogin(true)}>Login</Tab>
        <Tab $active={!isLogin} onClick={() => setIsLogin(false)}>Register</Tab>
      </TabContainer>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input 
            type="text" 
            name="username"
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange}
            required
          />
        )}
        <Input 
          type="email" 
          name="email"
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
        <Input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          required
        />
        <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
      </form>

      <GoogleButton onClick={handleGoogleLogin}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" width="20" />
        Sign in with Google
      </GoogleButton>
    </LoginCard>
  );
}
