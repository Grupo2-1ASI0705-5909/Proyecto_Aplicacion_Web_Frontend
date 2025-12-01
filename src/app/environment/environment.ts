// Archivo: src/app/environment/environment.ts
// Configuración para DESARROLLO LOCAL

export const environment = {
    production: false,

    // 1. Apuntamos al Backend de tu computadora (localhost)
    apiUrl: 'http://localhost:8080/api',
    loginUrl: 'http://localhost:8080/login',

    // 2. Dominios permitidos (Lista blanca para enviar el Token)
    // IMPORTANTE: Sin "http://" ni "https://"
    allowedDomains: [
        'localhost:8080'
    ],

    // 3. Rutas donde NO se debe enviar el token (Públicas)
    disallowedRoutes: [
        'http://localhost:8080/login',
        'http://localhost:8080/api/auth/register',
        'http://localhost:8080/api/auth/forgot-password'
    ]
};