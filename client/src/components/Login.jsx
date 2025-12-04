import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #fff;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  color: ${props => props.$active ? '#4ecca3' : 'rgba(255, 255, 255, 0.6)'};
  border-bottom: 2px solid ${props => props.$active ? '#4ecca3' : 'transparent'};
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    color: #4ecca3;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.3);
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
    const url = `http://localhost:3000${endpoint}`; // Should use env var

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
