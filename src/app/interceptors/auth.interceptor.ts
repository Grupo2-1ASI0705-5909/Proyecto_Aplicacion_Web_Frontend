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

            // Manejo de errores 401 (No autorizado)
            if (error.status === 401) {
                const token = sessionStorage.getItem('token');
                const errorMessage = error.error?.message || error.message || '';

                // Solo cerrar sesión si el token está expirado/inválido o no existe
                const isTokenExpired = !token ||
                    errorMessage.toLowerCase().includes('expired') ||
                    errorMessage.toLowerCase().includes('invalid') ||
                    errorMessage.toLowerCase().includes('expirado') ||
                    errorMessage.toLowerCase().includes('inválido');

                if (isTokenExpired) {
                    snackBar.open('Sesión expirada. Por favor, inicie sesión nuevamente.', 'Cerrar', {
                        duration: 4000,
                        panelClass: ['error-snackbar']
                    });

                    // Limpiar token y redirigir al login
                    sessionStorage.removeItem('token');
                    router.navigate(['/login']);
                } else {
                    // 401 pero token válido = falta de permisos específicos
                    // No cerrar sesión, solo notificar
                    snackBar.open('No tiene autorización para esta operación.', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['warning-snackbar']
                    });
                    // No redirigir, dejar que el guard o componente maneje
                }
            }

            // Manejo de errores 403 (Prohibido - Sin permisos)
            if (error.status === 403) {
                snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['warning-snackbar']
                });
                // No redirigir automáticamente, dejar que el componente maneje
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
