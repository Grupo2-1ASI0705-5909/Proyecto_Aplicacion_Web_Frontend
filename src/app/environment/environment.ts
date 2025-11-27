// Archivo: src/app/environment/environment.ts
// Configuración para DESARROLLO (local)

export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
    loginUrl: 'http://localhost:8080/login',
    allowedDomains: ['localhost:8080'],
    disallowedRoutes: [
        'http://localhost:8080/login',
        'http://localhost:8080/api/auth/register',
        'http://localhost:8080/api/auth/forgot-password'
    ]
};
