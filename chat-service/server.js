require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

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

// Connect to MongoDB
let useInMemory = false;
const messages = []; // In-memory store

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

// Basic Route
app.get('/', (req, res) => {
  res.send('Chat Service is running');
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Send history if in-memory
    if (useInMemory) {
      const roomMessages = messages.filter(m => m.roomId === roomId);
      roomMessages.forEach(m => socket.emit('new_message', m));
    }
  });

  socket.on('send_message', async (data) => {
    // data: { roomId, text, senderId, clientTempId }
    console.log('Received message:', data);

    const messageData = {
      ...data,
      status: 'pending',
      _id: new mongoose.Types.ObjectId(), // Temporary ID
      createdAt: new Date()
    };

    // Emit pending status back to sender
    socket.emit('message_pending', {
      clientTempId: data.clientTempId,
      serverId: messageData._id
    });

    // 2. Send to AI Service
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/moderate`, {
        text: data.text
      });

      const moderationResult = aiResponse.data; // { action: 'allow'|'flag'|'block', ... }
      
      // 3. Update Status based on AI response
      let finalStatus = 'allowed';
      if (moderationResult.action === 'flag') finalStatus = 'flagged';
      if (moderationResult.action === 'block') finalStatus = 'blocked';

      messageData.status = finalStatus;
      messageData.moderation = moderationResult;

      // Save to DB or In-Memory
      if (useInMemory) {
        messages.push(messageData);
      } else {
        // TODO: Implement Message Model and save to DB
        // const newMessage = new Message(messageData);
        // await newMessage.save();
      }

      // 4. Broadcast result
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
      // Fallback: Allow or Block? Let's flag it if AI fails? Or allow?
      // For now, let's allow but log error
      messageData.status = 'allowed'; // Default if AI fails
      if (useInMemory) messages.push(messageData);
      io.to(data.roomId).emit('new_message', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
