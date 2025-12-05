// Archivo: src/app/environment/environment.ts
// Configuración para DESARROLLO LOCAL
export const environment = {
    production: false,
    apiUrl: 'https://proyecto-aplicacion-web.onrender.com/api',
    loginUrl: 'https://proyecto-aplicacion-web.onrender.com/login',
    allowedDomains: ['proyecto-aplicacion-web.onrender.com'],
    disallowedRoutes: [
      'https://proyecto-aplicacion-web.onrender.com/login',
      'https://proyecto-aplicacion-web.onrender.com/api/auth/register',
      'https://proyecto-aplicacion-web.onrender.com/api/auth/forgot-password'
    ],
    // External APIs
    coinGeckoApiUrl: 'https://api.coingecko.com/api/v3',
    adviceSlipApiUrl: 'https://api.adviceslip.com',
    cryptoPriceUpdateInterval: 600000 // 10 minutes
};
