import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { environment } from './environment/environment';
import { authInterceptor } from './interceptors/auth.interceptor';

// Función para obtener el token
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
    provideAnimationsAsync(),

    // 1. Configuramos HttpClient con el interceptor global y soporte para DI
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]), // Interceptor global para errores
      withInterceptorsFromDi()
    ),

    // 2. Configuración del Módulo JWT usando variables de entorno
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          // Dominios donde SÍ se debe enviar el token (desde environment)
          allowedDomains: environment.allowedDomains,
          // Rutas donde NO se debe enviar el token (desde environment)
          disallowedRoutes: environment.disallowedRoutes,
        },
      })
    )
  ]
};
