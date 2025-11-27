// Archivo: src/app/environment/environment.prod.ts
// Configuración para PRODUCCIÓN

export const environment = {
    production: true,
    apiUrl: 'https://tu-dominio-produccion.com/api',
    loginUrl: 'https://tu-dominio-produccion.com/login',
    allowedDomains: ['tu-dominio-produccion.com'],
    disallowedRoutes: [
        'https://tu-dominio-produccion.com/login',
        'https://tu-dominio-produccion.com/api/auth/register',
        'https://tu-dominio-produccion.com/api/auth/forgot-password'
    ]
};
