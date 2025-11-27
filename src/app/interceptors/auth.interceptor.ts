// Archivo: src/app/interceptors/auth.interceptor.ts
// Interceptor para manejar errores HTTP globalmente y expiración de token

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            // Manejo de errores 401 (No autorizado - Token inválido o expirado)
            if (error.status === 401) {
                snackBar.open('Sesión expirada. Por favor, inicie sesión nuevamente.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });

                // Limpiar token y redirigir al login
                sessionStorage.removeItem('token');
                router.navigate(['/login']);
            }

            // Manejo de errores 403 (Prohibido - Sin permisos)
            if (error.status === 403) {
                snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });

                // Redirigir al dashboard
                router.navigate(['/dashboard']);
            }

            // Manejo de errores 404 (No encontrado)
            if (error.status === 404) {
                snackBar.open('Recurso no encontrado.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['warning-snackbar']
                });
            }

            // Manejo de errores 500 (Error del servidor)
            if (error.status === 500) {
                snackBar.open('Error del servidor. Intente nuevamente más tarde.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });
            }

            // Manejo de errores de red (sin conexión)
            if (error.status === 0) {
                snackBar.open('Error de conexión. Verifique su conexión a internet.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });
            }

            // Propagar el error para que los componentes puedan manejarlo si es necesario
            return throwError(() => error);
        })
    );
};
