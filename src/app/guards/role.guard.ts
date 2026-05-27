import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data['roles'] ?? [];
  const userRole = auth.getRol();

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.length === 0 || (userRole && allowedRoles.includes(userRole))) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
