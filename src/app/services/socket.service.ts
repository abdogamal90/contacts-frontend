import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  constructor() {
    this.socket = io('http://localhost:8000');
  }

  startEditing(contactId: string, username: string) {
    this.socket.emit('startEditing', { contactId, username });
  }

  stopEditing(contactId: string) {
    this.socket.emit('stopEditing', { contactId });
  }

  onEditingStatusChanged(callback: (data: any) => void) {
    this.socket.on('editingStatusChanged', callback);
  }
}