import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  if (auth.hasRefreshToken()) {
    return auth.restoreSession().pipe(
      map((restored) => (restored ? true : router.createUrlTree(['/login']))),
    );
  }

  return router.createUrlTree(['/login']);
};
