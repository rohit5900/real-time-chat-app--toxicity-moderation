import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';
import MessageBubble from './MessageBubble';

const Layout = styled.div`
  display: flex;
  width: 1000px;
  height: 600px;
  background: ${props => props.theme.cardBg};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.cardBorder};
  overflow: hidden;
  color: ${props => props.theme.text};
`;

const Sidebar = styled.div`
  width: 250px;
  background: ${props => props.theme.sidebarBg};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.cardBorder};
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.cardBorder};
  h3 { margin: 0; color: ${props => props.theme.text}; }
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
  color: ${props => props.$active ? props.theme.accent : props.theme.text};
  opacity: ${props => props.$active ? 1 : 0.7};
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${props => props.theme.cardBorder};
    opacity: 1;
  }
`;

const DeleteChannelBtn = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 71, 87, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  &:hover {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
  }
`;

const CreateChannelBtn = styled.button`
  margin: 1rem;
  padding: 10px;
  background: ${props => props.theme.inputBg};
  border: 1px dashed ${props => props.theme.cardBorder};
  color: ${props => props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    background: ${props => props.theme.cardBorder};
    opacity: 1;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.sidebarBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.cardBorder};
`;

const RoomInfo = styled.div`
  h3 { margin: 0; color: ${props => props.theme.text}; }
  span { font-size: 0.8rem; opacity: 0.6; }
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

const ClearBtn = styled.button`
  background: rgba(255, 165, 2, 0.2);
  color: #ffa502;
  border: 1px solid rgba(255, 165, 2, 0.3);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  &:hover { background: rgba(255, 165, 2, 0.3); }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${props => props.theme.cardBorder}; border-radius: 3px; }
`;

const InputArea = styled.form`
  padding: 1.5rem;
  background: ${props => props.theme.sidebarBg};
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  outline: none;
  &:focus { background: ${props => props.theme.cardBorder}; }
`;

const SendButton = styled.button`
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.accent};
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  &:hover { filter: brightness(1.1); }
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
    socket.emit('join_room', { roomId: currentRoom, username });

    socket.on('channel_list', (list) => {
      setChannels(list);
    });
    
    socket.on('channel_deleted', (deletedChannel) => {
      if (currentRoom === deletedChannel) {
        alert(`Channel #${deletedChannel} has been deleted.`);
        setCurrentRoom('General');
        setMessages([]);
      }
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

    socket.on('message_deleted', (messageId) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    socket.on('history_cleared', () => {
      setMessages([]);
    });

    return () => {
      socket.off('channel_list');
      socket.off('channel_deleted');
      socket.off('room_data');
      socket.off('new_message');
      socket.off('message_blocked');
      socket.off('message_deleted');
      socket.off('history_cleared');
    };
  }, [currentRoom, username]); // Re-run when room changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSwitchChannel = (channel) => {
    if (channel !== currentRoom) {
      setMessages([]); // Clear messages on room switch
      setCurrentRoom(channel);
    }
  };

  const handleCreateChannel = () => {
    const name = prompt("Enter new channel name:");
    if (name) {
      socket.emit('create_channel', name);
    }
  };

  const handleDeleteChannel = (e, channelName) => {
    e.stopPropagation(); // Prevent switching channel when clicking delete
    if (['General', 'Random', 'Tech'].includes(channelName)) {
      alert("Cannot delete default channels.");
      return;
    }
    if (window.confirm(`Delete channel #${channelName}? This will delete all messages in it.`)) {
      socket.emit('delete_channel', channelName);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Simple reload to reset state
  };

  const handleClearHistory = () => {
    if(window.confirm(`Are you sure you want to clear all messages in #${currentRoom}?`)) {
      socket.emit('clear_history', currentRoom);
    }
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

  const handleForward = (text) => {
    setInputValue(`Fwd: ${text}`);
  };

  const handleDelete = (messageId) => {
    if(window.confirm("Are you sure you want to delete this message?")) {
      socket.emit('delete_message', messageId);
    }
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
              <span># {channel}</span>
              {!['General', 'Random', 'Tech'].includes(channel) && (
                <DeleteChannelBtn onClick={(e) => handleDeleteChannel(e, channel)}>✕</DeleteChannelBtn>
              )}
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
            <ClearBtn onClick={handleClearHistory}>Clear Chat</ClearBtn>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
          </div>
        </Header>
        <MessagesArea>
          {messages.map((msg, index) => (
            <MessageBubble 
              key={msg._id || index} 
              message={msg} 
              isOwn={msg.senderId === username}
              onForward={handleForward}
              onDelete={handleDelete}
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
