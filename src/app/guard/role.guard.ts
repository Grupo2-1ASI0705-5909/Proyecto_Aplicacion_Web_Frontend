// Archivo: src/app/guard/role.guard.ts
// Guard para verificar roles específicos de usuario

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../service/login-service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    // 1. Verificar si el usuario está logueado
    if (!loginService.verificar()) {
        router.navigate(['/login']);
        return false;
    }

    // 2. Obtener el rol esperado de la configuración de la ruta
    const expectedRoles = route.data['roles'] as string[];

    // Si no se especificaron roles, permitir acceso (solo requiere estar logueado)
    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    // 3. Obtener el rol del usuario actual
    const userRole = loginService.showRole();

    // 4. Verificar si el usuario tiene alguno de los roles permitidos
    const hasRole = expectedRoles.some(role => {
        if (Array.isArray(userRole)) {
            return userRole.includes(role);
        }
        return userRole === role;
    });

    // 5. Si no tiene el rol, denegar acceso
    if (!hasRole) {
        snackBar.open('No tiene permisos para acceder a esta sección.', 'Cerrar', {
            duration: 3000,
            panelClass: ['warning-snackbar']
        });

        // Redirigir al dashboard
        router.navigate(['/dashboard']);
        return false;
    }

    return true;
};
