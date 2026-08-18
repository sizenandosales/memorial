import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificação precisa: Se for uma busca pública de memorial por slug (GET /memorials/ALGUM-SLUG)
  // O endpoint geral de listar do usuário logado geralmente é só GET /memorials (sem barra extra com slug)
  const isPublicGetMemorial = req.method === 'GET' && req.url.match(/\/memorials\/[^/]+$/);

  if (isPublicGetMemorial) {
    return next(req); // Deixa passar limpo, sem token
  }

  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const rawToken = localStorage.getItem('access_token');

    if (rawToken) {
      const token = rawToken.trim();

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }
  }

  return next(req);
};
