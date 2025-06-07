import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/verify/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
