import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
class SocketService {
  socket = null;
  connect() {
    this.socket = io(SOCKET_URL);
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