import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';
import MessageBubble from './MessageBubble';

const ChatContainer = styled.div`
  width: 900px;
  height: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RoomInfo = styled.h3`
  margin: 0;
  color: #fff;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const InputArea = styled.form`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  outline: none;

  &:focus {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SendButton = styled.button`
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  background: #4ecca3;
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #45b393;
  }
`;

export default function ChatRoom({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('message_pending', (data) => {
      // Optimistic update or just wait?
      // For now, we'll handle the 'pending' state via the list if we added it optimistically.
      // But here we receive the server ID.
      // Let's rely on the 'new_message' broadcast for simplicity in this MVP, 
      // or we can add it locally first.
      // If we add locally, we need to match IDs.
    });

    socket.on('message_blocked', (data) => {
       // Find the pending message and mark it blocked
       // For MVP, we might just show an alert or a system message
       alert(`Message blocked: ${data.reason}`);
    });

    return () => {
      socket.off('new_message');
      socket.off('message_pending');
      socket.off('message_blocked');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const tempId = Date.now().toString();
    const messageData = {
      roomId: room,
      text: inputValue,
      senderId: username,
      clientTempId: tempId
    };

    // Optimistic UI: Add to list immediately as pending
    // We need to handle this carefully to avoid duplicates when server broadcasts back
    // For this MVP, let's just emit and wait for server broadcast to keep it simple and consistent.
    // Or we can add it with a 'pending' status locally.
    
    // Let's add it locally
    /*
    setMessages(prev => [...prev, {
      ...messageData,
      status: 'pending'
    }]);
    */
    // Actually, the server broadcasts 'new_message' even to the sender in our server.js logic.
    // So we don't need to add it locally if the server is fast enough.
    // But for 'pending' feedback, we might want it.
    // Let's stick to server broadcast for now to avoid duplicate logic.

    socket.emit('send_message', messageData);
    setInputValue('');
  };

  return (
    <ChatContainer>
      <Header>
        <RoomInfo>#{room}</RoomInfo>
        <div>Logged in as <b>{username}</b></div>
      </Header>
      <MessagesArea>
        {messages.map((msg, index) => (
          <MessageBubble 
            key={msg._id || index} 
            message={msg} 
            isOwn={msg.senderId === username} 
          />
        ))}
        <div ref={messagesEndRef} />
      </MessagesArea>
      <InputArea onSubmit={sendMessage}>
        <MessageInput 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Type a message..." 
        />
        <SendButton type="submit">Send</SendButton>
      </InputArea>
    </ChatContainer>
  );
}
