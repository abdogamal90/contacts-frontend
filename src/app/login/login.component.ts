import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe(
      (response) => {
        this.notification.success('Login successful! Welcome back.');
        localStorage.setItem('username', this.loginForm.value.username);
        this.router.navigate(['/contacts']);
      },
      (error) => {
        this.notification.handleError(error, 'Login failed. Please check your credentials.');
      },
    );
  }
}
