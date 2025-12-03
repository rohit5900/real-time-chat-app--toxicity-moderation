import React, { useState } from 'react';
import styled from 'styled-components';

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 350px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #fff;
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

  &:hover {
    transform: scale(1.02);
    background: #45b393;
  }
`;

export default function Login({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) {
      onJoin(username, room);
    }
  };

  return (
    <LoginCard>
      <Title>Join Chat</Title>
      <form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input 
          type="text" 
          placeholder="Room Name" 
          value={room} 
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit">Enter Room</Button>
      </form>
    </LoginCard>
  );
}
