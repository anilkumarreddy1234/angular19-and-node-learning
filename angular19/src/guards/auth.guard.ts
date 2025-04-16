import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  // Check if the user is authenticated (has a token or is not logged out)
  if ((authService.getToken()) && !authService.getIsLoggedOut()) {
    return true; // Allow access
  }

  // Redirect to login if not authenticated
  return router.createUrlTree(['/login']);
};