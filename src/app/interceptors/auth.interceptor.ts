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
                    // Token realmente expirado - limpiar y notificar
                    // NO redirigir aquí, dejar que el componente lo haga
                    sessionStorage.removeItem('token');

                    // Solo mostrar mensaje si no estamos en la página de login
                    if (!router.url.includes('/login')) {
                        snackBar.open('⏱️ Sesión expirada. Por favor, inicie sesión nuevamente.', 'Cerrar', {
                            duration: 4000,
                            panelClass: ['error-snackbar']
                        });
                    }
                }
                // Si el token es válido pero hay 401, es un problema de permisos
                // Dejar que el componente maneje el error (no mostrar snackbar aquí)
            }

            // Manejo de errores 403, 404, 500 - Dejar que los componentes los manejen
            // Solo interceptamos para logging, no mostramos snackbars aquí
            // para evitar duplicados con el manejo en componentes

            /* DESHABILITADO - Los componentes manejan estos errores
            if (error.status === 403) {
                snackBar.open('No tiene permisos para realizar esta acción.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['warning-snackbar']
                });
            }

            if (error.status === 404) {
                snackBar.open('Recurso no encontrado.', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['warning-snackbar']
                });
            }

            if (error.status === 500) {
                snackBar.open('Error del servidor. Intente nuevamente más tarde.', 'Cerrar', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });
            }
            */

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
