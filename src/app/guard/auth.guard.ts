import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CacheStorageService } from '../services/cache-storage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cacheStorageService = inject(CacheStorageService);
  
  try {

    let user = cacheStorageService.getItem(cacheStorageService.userInfoKey);
    if (user) {
      authService.setFromCache(user);
    }

    let isLogged = authService.isAuthLoginCompleted();
    if (isLogged) { return true; }
    else {
      return router.createUrlTree(['/login']);
    }
  } catch (error) {
    return router.createUrlTree(['/login']);
  }
};
