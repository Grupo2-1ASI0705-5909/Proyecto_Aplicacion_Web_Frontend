import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';

// Función para obtener el token (Igual que la de tu amigo)
export function tokenGetter() {
  // Verificamos si estamos en el navegador para evitar errores
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Buscamos el token en sessionStorage
  return sessionStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // 1. Configuramos HttpClient para que acepte interceptores de librerías (DI)
    provideHttpClient(withFetch(), withInterceptorsFromDi()),

    // 2. Configuración del Módulo JWT (La magia de tu amigo)
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          // Dominios donde SÍ se debe enviar el token (Tu backend)
          allowedDomains: ['localhost:8080'],
          // Rutas donde NO se debe enviar el token (Login, Registro, Olvidé contraseña)
          disallowedRoutes: [
            'http://localhost:8080/login',
          ],
        },
      })
    )
  ]
};
