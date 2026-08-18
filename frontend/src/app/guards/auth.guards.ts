import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Se estiver rodando no servidor (SSR), permite a renderização inicial
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // No navegador, verifica se o access_token existe no localStorage
  const token = localStorage.getItem('access_token'); // <--- Ajustado de 'token' para 'access_token'

  if (token) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
