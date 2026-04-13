import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth';

export const redirectIfAuthenticatedGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.parseUrl('/dashboard');
  }

  return true;
};
