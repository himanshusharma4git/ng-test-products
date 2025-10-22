import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Session } from '../services/session';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const session = inject(Session);
  const router = inject(Router);
  const user_token = session.getSessionStorage('auth_token');
  const userDetails = session.getSessionStorageObject<any>('details');
  if(!user_token || !userDetails) {
    console.log('User is not authenticated, redirecting to login.');
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
