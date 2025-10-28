import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 3000) {
    this.show('success', message, duration);
  }

  /**
   * Show an error notification
   */
  error(message: string, duration: number = 5000) {
    this.show('error', message, duration);
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration: number = 4000) {
    this.show('warning', message, duration);
  }

  /**
   * Show an info notification
   */
  info(message: string, duration: number = 3000) {
    this.show('info', message, duration);
  }

  /**
   * Show a notification with custom type
   */
  private show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number) {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration
    };
    
    this.notificationSubject.next(notification);
  }

  /**
   * Generate a unique ID for each notification
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle backend errors and show appropriate notification
   */
  handleError(error: any, defaultMessage: string = 'An error occurred') {
    console.error('Error:', error);
    
    let errorMessage = defaultMessage;
    
    // Handle array of validation errors from backend
    if (error.error && Array.isArray(error.error.errors)) {
      errorMessage = error.error.errors.map((e: any) => e.msg).join(', ');
    } 
    // Handle single error message
    else if (error.error && error.error.error) {
      errorMessage = error.error.error;
    } 
    // Handle message property
    else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    // Handle string error
    else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }
    
    this.error(errorMessage);
  }
}
