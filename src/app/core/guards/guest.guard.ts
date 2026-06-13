import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  if (auth.hasRefreshToken()) {
    return auth.restoreSession().pipe(
      map((restored) => (restored ? router.createUrlTree(['/dashboard']) : true)),
    );
  }

  return true;
};
