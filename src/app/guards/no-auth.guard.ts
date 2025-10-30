import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  // If user is NOT authenticated, allow access to login/register/welcome pages
  if (!authService.isAuthenticated()) {
    return true;
  }

  // If user is authenticated, notify and redirect to contacts
  notification.info('You are already signed in.');
  router.navigate(['/contacts']);
  return false;
};
