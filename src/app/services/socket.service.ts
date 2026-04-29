import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  constructor() {
    // Same host as the SPA when apiBaseUrl is empty (Netlify proxy); else direct (e.g. local http → http API).
    this.socket = environment.apiBaseUrl
      ? io(environment.apiBaseUrl)
      : io({ path: '/socket.io/' });
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