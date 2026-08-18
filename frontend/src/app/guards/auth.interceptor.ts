import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token salvo no localStorage
  const token = localStorage.getItem('token');

  // Se o token existir, clona a requisição e adiciona o cabeçalho de autorização
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  // Se não houver token, passa a requisição original adiante (ex: rotas de login/registro)
  return next(req);
};
