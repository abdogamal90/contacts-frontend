import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ProfileComponent {
  usernameForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private notification: NotificationService
  ) {
    this.usernameForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loadProfile();
  }

  loadProfile() {
    this.auth.getProfile().subscribe(
      (res: any) => {
        this.usernameForm.patchValue({ username: res.username });
      },
      (error) => {
        this.notification.error('Failed to load profile');
      }
    );
  }

  saveUsername() {
    // Mark field as touched to show validation errors
    this.usernameForm.markAllAsTouched();
    
    if (this.usernameForm.invalid) {
      this.notification.warning('Please enter a valid username');
      return;
    }
    
    const username = this.usernameForm.value.username;
    this.auth.updateUsername(username).subscribe(
      () => {
        this.notification.success('Username updated successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('username', username);
        }
      },
      (error) => {
        this.notification.handleError(error, 'Failed to update username');
      }
    );
  }

  changePassword() {
    // Mark all fields as touched to show validation errors
    this.passwordForm.markAllAsTouched();
    
    if (this.passwordForm.invalid) {
      this.notification.warning('Please fill in all password fields correctly');
      return;
    }
    
    const { oldPassword, newPassword } = this.passwordForm.value;
    this.auth.updatePassword(oldPassword, newPassword).subscribe(
      () => {
        this.notification.success('Password updated successfully!');
        this.passwordForm.reset();
      },
      (error) => {
        this.notification.handleError(error, 'Failed to update password');
      }
    );
  }

  logout() {
    this.auth.logout();
  }
}
