import io from 'socket.io-client';

// Connect to the Chat Service
// In production, this URL should be an environment variable
const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: false
});
