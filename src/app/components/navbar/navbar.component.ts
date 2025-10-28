import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  constructor(public auth: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  get username(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('username');
    }
    return null;
  }

  logout() {
    this.auth.logout();
  }
  login() {
    this.router.navigate(['/login']);
  }
}
