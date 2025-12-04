require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
let useInMemory = false;
const messages = []; // In-memory store
const channels = ['General', 'Random', 'Tech']; // Default channels

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  console.log('Switching to In-Memory Storage');
  useInMemory = true;
});

app.get('/', (req, res) => {
  res.send('Chat Service is running');
});

// Track users in rooms
const getUsersInRoom = (roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send available channels
  socket.emit('channel_list', channels);

  socket.on('join_room', ({ roomId, username }) => {
    // Leave previous rooms (optional, depending on UX)
    // socket.rooms.forEach(room => { if(room !== socket.id) socket.leave(room); });

    socket.join(roomId);
    socket.username = username; // Store username in socket session
    socket.currentRoom = roomId;

    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);

    // Send history if in-memory
    if (useInMemory) {
      const roomMessages = messages.filter(m => m.roomId === roomId);
      roomMessages.forEach(m => socket.emit('new_message', m));
    }

    // Broadcast room info (user count)
    io.to(roomId).emit('room_data', {
      room: roomId,
      users: getUsersInRoom(roomId)
    });
  });

  socket.on('create_channel', (channelName) => {
    if (!channels.includes(channelName)) {
      channels.push(channelName);
      io.emit('channel_list', channels); // Broadcast to everyone
    }
  });

  socket.on('send_message', async (data) => {
    console.log('Received message:', data);

    const messageData = {
      ...data,
      status: 'pending',
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date()
    };

    socket.emit('message_pending', {
      clientTempId: data.clientTempId,
      serverId: messageData._id
    });

    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/moderate`, {
        text: data.text
      });

      const moderationResult = aiResponse.data;
      
      let finalStatus = 'allowed';
      if (moderationResult.action === 'flag') finalStatus = 'flagged';
      if (moderationResult.action === 'block') finalStatus = 'blocked';

      messageData.status = finalStatus;
      messageData.moderation = moderationResult;

      if (useInMemory) {
        messages.push(messageData);
      }

      if (finalStatus !== 'blocked') {
        io.to(data.roomId).emit('new_message', messageData);
      } else {
        socket.emit('message_blocked', {
          clientTempId: data.clientTempId,
          reason: 'Message blocked by AI moderation'
        });
      }

    } catch (error) {
      console.error('AI Service Error:', error.message);
      messageData.status = 'allowed';
      if (useInMemory) messages.push(messageData);
      io.to(data.roomId).emit('new_message', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.currentRoom) {
      io.to(socket.currentRoom).emit('room_data', {
        room: socket.currentRoom,
        users: getUsersInRoom(socket.currentRoom)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
