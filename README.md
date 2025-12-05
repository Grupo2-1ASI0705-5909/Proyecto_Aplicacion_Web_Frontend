# FlexPay - Sistema de Pagos con Criptomonedas

Sistema completo de gestión de transacciones con criptomonedas desarrollado con Angular y Spring Boot.

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- Angular 18 (Standalone Components)
- Angular Material UI
- TypeScript
- RxJS para manejo reactivo
- HttpClient para comunicación con APIs

**Backend:**
- Spring Boot 3.x
- Spring Security con JWT
- JPA/Hibernate
- Base de datos relacional (MySQL/PostgreSQL)
- RESTful API

**APIs Externas:**
- CoinGecko API para precios de criptomonedas en tiempo real
- Advice Slip API para consejos financieros

## Estructura del Proyecto

```
FRONTEND/
├── src/
│   ├── app/
│   │   ├── autenticador/          # Módulo de autenticación
│   │   │   ├── autenticador.html  # Login
│   │   │   └── registro/          # Registro de usuarios
│   │   ├── component/
│   │   │   ├── chatbot/           # Asistente financiero
│   │   │   ├── dashboard/         # Panel principal
│   │   │   ├── comercio/          # Gestión de comercios
│   │   │   ├── usuario/           # Gestión de usuarios
│   │   │   ├── operaciones/       # Transacciones y métodos de pago
│   │   │   ├── finanzas/          # Wallets y precios crypto
│   │   │   └── sistema/           # Notificaciones
│   │   ├── model/                 # Modelos de datos TypeScript
│   │   ├── service/               # Servicios Angular
│   │   ├── guard/                 # Guards de autenticación y roles
│   │   └── interceptor/           # Interceptor HTTP para JWT
│   ├── environment/               # Configuraciones de entorno
│   └── assets/                    # Recursos estáticos
└── BACKEND/                       # Proyecto Spring Boot (separado)
```

## Módulos Principales

### 1. Autenticación y Autorización

**Login Service (`login-service.ts`)**
- Gestión de tokens JWT en localStorage
- Verificación de roles (ADMINISTRADOR, COMERCIO, USUARIO)
- Métodos de autenticación y logout
- Decodificación de tokens para obtener información del usuario

**Auth Guard (`auth.guard.ts`)**
- Protección de rutas que requieren autenticación
- Redirección a login si no hay sesión válida

**Role Guard (`role.guard.ts`)**
- Control de acceso basado en roles
- Validación de permisos por ruta

**HTTP Interceptor (`http-auth.interceptor.ts`)**
- Inyección automática de token JWT en headers
- Manejo de errores 401/403
- Logout automático en caso de token expirado

### 2. Dashboard

**Componente Principal:**
- Vista diferenciada por roles (Admin, Comercio, Usuario)
- KPIs en tiempo real
- Gráficos de tendencias (SVG personalizados)
- Distribución de criptomonedas
- Top usuarios por volumen
- Actividad reciente

**Características Admin:**
- Total de usuarios registrados
- Volumen total de transacciones
- Ingresos estimados
- Gráfico de tendencia (últimos 7 días)
- Distribución por criptomoneda
- Top 5 usuarios

**Características Usuario/Comercio:**
- Patrimonio total en USD
- Ventas totales (comercio)
- Acciones rápidas
- Historial de transacciones

### 3. Gestión de Usuarios

**Funcionalidades:**
- CRUD completo de usuarios
- Validación asíncrona de emails únicos
- Asignación de roles
- Perfil de usuario editable
- Cambio de contraseña
- Gestión de estado activo/inactivo

**Validaciones:**
- Email único (validador asíncrono)
- Formato de email
- Longitud de contraseña
- Campos requeridos

### 4. Gestión de Comercios

**Funcionalidades:**
- Registro de comercios
- Validación de RUC único
- Asociación con usuarios
- Estados activo/inactivo
- Información fiscal completa

**Datos del Comercio:**
- Nombre comercial
- RUC
- Dirección fiscal
- Teléfono
- Email
- Usuario responsable

### 5. Transacciones

**Flujo de Transacción:**
1. Selección de wallet del usuario
2. Selección de comercio destinatario
3. Entrada de monto en moneda FIAT
4. Cálculo automático de cripto según tasa actual
5. Selección de método de pago
6. Opción de plan de pago (cuotas)
7. Validación y creación

**Características:**
- Cálculo de tasas en backend (seguridad)
- Validación de saldos
- Generación de cuotas automática
- Estados de transacción
- Filtros avanzados (fecha, estado, cripto)
- Exportación de datos

### 6. Wallets (Billeteras)

**Funcionalidades:**
- Creación de wallets por criptomoneda
- Dirección única por wallet
- Saldo en cripto
- Conversión a USD en tiempo real
- Asociación usuario-criptomoneda
- Historial de transacciones por wallet

**Características:**
- Validación de dirección de wallet
- Prevención de duplicados
- Estados activo/inactivo
- Cálculo de patrimonio total

### 7. Criptomonedas

**Gestión:**
- CRUD de criptomonedas soportadas
- Código (BTC, ETH, etc.)
- Nombre completo
- Símbolo
- Decimales permitidos
- Estado activo/inactivo

**Top 5 Criptomonedas:**
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- Binance Coin (BNB)
- USD Coin (USDC)

### 8. Tipos de Cambio

**Integración CoinGecko:**
- Actualización automática cada 10 minutos
- Precios en tiempo real
- Conversión cripto-USD y cripto-cripto
- Caché de tasas
- Observable para suscripción reactiva

**Servicio (`tipo-cambio.service.ts`):**
```typescript
tasasEnTiempoReal$: BehaviorSubject<TipoCambio[]>
```

**Componente de Precios (`crypto-prices.component.ts`):**
- Display de precios en tiempo real
- Actualización automática
- Indicadores de cambio
- Integración con CoinGecko API

### 9. Chatbot Financiero

**Arquitectura:**

**Servicio (`chatbot.service.ts`):**
- Integración con Advice Slip API
- Búsqueda por palabras clave financieras
- 60+ keywords relacionadas con finanzas
- Sistema de fallback en múltiples niveles
- Manejo robusto de errores

**Palabras Clave Financieras:**
```
money, finance, financial, invest, investment, save, saving,
budget, debt, credit, spend, income, business, profit, bank,
economy, tax, career, job, work, etc.
```

**Componente (`chatbot.component.ts`):**
- Widget flotante (bottom-right)
- Interfaz conversacional
- Historial de mensajes
- Opciones rápidas:
  - Consejos de ahorro
  - Consejos de inversión
  - Seguridad cripto
  - Presupuesto
- Procesamiento de intenciones
- Auto-scroll
- Input de texto con Enter
- Botón de reinicio

**UI/UX:**
- Diseño tipo chat bubble
- Gradientes naranjas
- Animaciones suaves
- Indicador de escritura
- Timestamps
- IDs de consejos
- Responsive

### 10. Métodos de Pago

**Tipos Soportados:**
- Transferencia bancaria
- Tarjeta de crédito/débito
- PayPal
- Wallet cripto
- Otros

**Atributos:**
- Nombre del método
- Descripción
- Comisión aplicable
- Estado activo/inactivo

### 11. Planes de Pago

**Características:**
- Nombre del plan
- Número de cuotas (3, 6, 12, 24, etc.)
- Interés aplicable
- Descripción
- Cálculo automático de cuotas

**Integración con Transacciones:**
- Generación automática de cuotas
- Fechas de vencimiento
- Montos por cuota
- Tracking de pagos

### 12. Notificaciones

**Sistema de Notificaciones:**
- Mensajes del sistema
- Alertas de transacciones
- Recordatorios de cuotas
- Estados: leída/no leída
- Filtros por usuario
- Timestamp de creación

## Servicios Core

### LoginService
```typescript
verificar(): boolean
getToken(): string | null
getUsuarioActual(): string | null
isAdmin(): boolean
isComercio(): boolean
isCliente(): boolean
logout(): void
```

### TransaccionService
```typescript
obtenerTodos(): Observable<Transaccion[]>
obtenerPorId(id): Observable<Transaccion>
obtenerPorUsuario(usuarioId): Observable<Transaccion[]>
crear(transaccion): Observable<Transaccion>
actualizar(transaccion): Observable<Transaccion>
eliminar(id): Observable<void>
```

### WalletService
```typescript
obtenerTodos(): Observable<Wallet[]>
obtenerPorUsuario(usuarioId): Observable<Wallet[]>
crear(wallet): Observable<Wallet>
actualizar(wallet): Observable<Wallet>
eliminar(id): Observable<void>
```

### TipoCambioService
```typescript
obtenerTodos(): Observable<TipoCambio[]>
obtenerPorCodigos(desde, hasta): Observable<TipoCambio>
actualizarDesdeAPI(): void
tasasEnTiempoReal$: BehaviorSubject<TipoCambio[]>
```

### CoinGeckoService
```typescript
obtenerPreciosTop5(): Observable<CoinGeckoPriceResponse>
obtenerPrecio(coinId): Observable<number>
```

### ChatbotService
```typescript
obtenerConsejoFinanciero(): Observable<Advice>
obtenerConsejoAleatorio(): Observable<Advice>
buscarConsejo(query): Observable<Advice[]>
obtenerConsejoPorId(id): Observable<Advice>
getFinancialKeywords(): string[]
```

## Modelos de Datos

### Usuario
```typescript
{
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  rol: Rol;
  fechaRegistro: Date;
  estado: boolean;
}
```

### Transaccion
```typescript
{
  transaccionId: number;
  usuario: Usuario;
  comercio: Comercio;
  wallet: Wallet;
  metodoPago: MetodoPago;
  planPago: PlanPago;
  montoTotalFiat: number;
  montoTotalCripto: number;
  tasaAplicada: number;
  codigoMoneda: string;
  fechaTransaccion: Date;
  estado: string;
}
```

### Wallet
```typescript
{
  walletId: number;
  usuario: Usuario;
  criptomoneda: Criptomoneda;
  direccionWallet: string;
  saldo: number;
  fechaCreacion: Date;
  estado: boolean;
}
```

### TipoCambio
```typescript
{
  tipoCambioId: number;
  desdeCodigo: string;
  hastaCodigo: string;
  tasa: number;
  fechaActualizacion: Date;
}
```

## Configuración de Entorno

### environment.ts (Desarrollo)
```typescript
{
  production: false,
  apiUrl: 'http://localhost:8080/api',
  loginUrl: 'http://localhost:8080/login',
  coinGeckoApiUrl: 'https://api.coingecko.com/api/v3',
  adviceSlipApiUrl: 'https://api.adviceslip.com',
  cryptoPriceUpdateInterval: 600000
}
```

### environment.prod.ts (Producción)
```typescript
{
  production: true,
  apiUrl: 'https://tu-dominio.com/api',
  loginUrl: 'https://tu-dominio.com/login',
  coinGeckoApiUrl: 'https://api.coingecko.com/api/v3',
  adviceSlipApiUrl: 'https://api.adviceslip.com',
  cryptoPriceUpdateInterval: 600000
}
```

## Seguridad

### JWT (JSON Web Tokens)
- Tokens almacenados en localStorage
- Expiración configurable
- Renovación automática
- Validación de firma en backend

### Roles y Permisos

**ADMINISTRADOR:**
- Acceso completo al sistema
- CRUD de usuarios, comercios, criptomonedas
- Gestión de tasas de cambio
- Visualización de todas las transacciones
- Dashboard con analytics avanzados

**COMERCIO:**
- Ver sus propias ventas
- Dashboard de comercio
- Gestión de perfil
- Notificaciones de transacciones

**USUARIO:**
- Crear transacciones
- Gestionar wallets
- Ver historial personal
- Dashboard de usuario
- Chatbot financiero

### Protección de Rutas
```typescript
{
  path: 'usuarios',
  component: UsuarioListarComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['ADMINISTRADOR'] }
}
```

### Encriptación
- Contraseñas hasheadas con BCrypt en backend
- HTTPS en producción
- Headers de seguridad (CORS, CSP)

## Deployment

### Build de Producción
```bash
ng build --configuration production
```

### Variables de Entorno
Configurar en `environment.prod.ts` antes del build.

### Servidor Web
- Nginx recomendado
- Configurar redirect a index.html para SPA
- HTTPS obligatorio
- Gzip habilitado

---

**Última actualización:** 2025-12-04  
**Versión:** 1.0.0  
**Tecnología:** Angular 18 + Spring Boot 3
