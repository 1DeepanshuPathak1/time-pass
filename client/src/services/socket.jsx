import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  
  connect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;