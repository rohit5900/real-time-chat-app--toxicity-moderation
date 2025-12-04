import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';
import MessageBubble from './MessageBubble';

const Layout = styled.div`
  display: flex;
  width: 1000px;
  height: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  h3 { margin: 0; color: #fff; }
`;

const ChannelList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ChannelItem = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.$active ? 'rgba(78, 204, 163, 0.2)' : 'transparent'};
  color: ${props => props.$active ? '#4ecca3' : 'rgba(255, 255, 255, 0.7)'};
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const CreateChannelBtn = styled.button`
  margin: 1rem;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RoomInfo = styled.div`
  h3 { margin: 0; color: #fff; }
  span { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); }
`;

const LogoutBtn = styled.button`
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: rgba(255, 71, 87, 0.3); }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
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
  &:focus { background: rgba(255, 255, 255, 0.2); }
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
  &:hover { background: #45b393; }
`;

export default function ChatRoom({ username, room: initialRoom }) {
  const [currentRoom, setCurrentRoom] = useState(initialRoom || 'General');
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial join
    joinRoom(currentRoom);

    socket.on('channel_list', (list) => {
      setChannels(list);
    });

    socket.on('room_data', ({ room, users }) => {
      if (room === currentRoom) {
        setOnlineUsers(users);
      }
    });

    socket.on('new_message', (message) => {
      if (message.roomId === currentRoom) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('message_blocked', (data) => {
       alert(`Message blocked: ${data.reason}`);
    });

    return () => {
      socket.off('channel_list');
      socket.off('room_data');
      socket.off('new_message');
      socket.off('message_blocked');
    };
  }, [currentRoom]); // Re-run when room changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (roomName) => {
    setMessages([]); // Clear messages on room switch
    socket.emit('join_room', { roomId: roomName, username });
  };

  const handleSwitchChannel = (channel) => {
    if (channel !== currentRoom) {
      setCurrentRoom(channel);
      // joinRoom is called via useEffect dependency
    }
  };

  const handleCreateChannel = () => {
    const name = prompt("Enter new channel name:");
    if (name) {
      socket.emit('create_channel', name);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Simple reload to reset state
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const tempId = Date.now().toString();
    const messageData = {
      roomId: currentRoom,
      text: inputValue,
      senderId: username,
      clientTempId: tempId
    };

    socket.emit('send_message', messageData);
    setInputValue('');
  };

  return (
    <Layout>
      <Sidebar>
        <SidebarHeader>
          <h3>Channels</h3>
        </SidebarHeader>
        <ChannelList>
          {channels.map(channel => (
            <ChannelItem 
              key={channel} 
              $active={channel === currentRoom}
              onClick={() => handleSwitchChannel(channel)}
            >
              # {channel}
            </ChannelItem>
          ))}
        </ChannelList>
        <CreateChannelBtn onClick={handleCreateChannel}>+ New Channel</CreateChannelBtn>
      </Sidebar>

      <ChatArea>
        <Header>
          <RoomInfo>
            <h3>#{currentRoom}</h3>
            <span>{onlineUsers} Online</span>
          </RoomInfo>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{username}</span>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
          </div>
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
            placeholder={`Message #${currentRoom}`} 
          />
          <SendButton type="submit">Send</SendButton>
        </InputArea>
      </ChatArea>
    </Layout>
  );
}
