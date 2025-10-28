import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(res => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    } else {
      return true;
    }
  }

  // Get current user's profile
  getProfile() {
    return this.http.get<{ username: string }>(`${this.apiUrl}/user/profile`);
  }

  // Update username
  updateUsername(username: string) {
    return this.http.put(`${this.apiUrl}/user/username`, { username });
  }

  // Update password (requires oldPassword and newPassword)
  updatePassword(oldPassword: string, newPassword: string) {
    return this.http.put(`${this.apiUrl}/user/password`, { oldPassword, newPassword });
  }

  // Logout helper
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }

}
