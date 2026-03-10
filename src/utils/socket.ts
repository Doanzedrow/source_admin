import { io, Socket } from 'socket.io-client';
import { API_URL_SOCKET } from '../config/constants';

const SOCKET_URL = API_URL_SOCKET;

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      const token = localStorage.getItem('accessToken');
      this.socket = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
         console.log('Socket initialized');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error', err);
      });
    }
  }

  disconnect() {
    if (this.socket) {
       this.socket.disconnect();
       this.socket = null;
    }
  }

  // Common subscribe helper
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  // Common unsubscribe helper
  unsubscribe(event: string) {
    if (!this.socket) return;
    this.socket.off(event);
  }
}

export const socketService = new SocketService();
