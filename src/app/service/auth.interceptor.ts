import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // 1. Buscamos el token guardado
  const token = localStorage.getItem('token');

  let authReq = req;

  // 2. Si existe, lo clonamos y lo pegamos en la cabecera
  // Es importante que diga "Bearer " (con espacio) antes del token
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Pasamos la petición y escuchamos si hay error 401 (Token vencido)
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // Si el token no sirve, borramos y mandamos al login
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
