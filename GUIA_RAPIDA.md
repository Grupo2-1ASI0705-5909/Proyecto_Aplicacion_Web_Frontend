# 🚀 GUÍA RÁPIDA - INICIO RÁPIDO

## ✅ Refactorización Completada

Todos los cambios han sido implementados exitosamente. Aquí está todo lo que necesitas saber para empezar.

---

## 📋 RESUMEN DE CAMBIOS

### ✅ Lo que se ELIMINÓ
- ❌ Modo Demo (botón "Cambiar Rol")
- ❌ URLs hardcodeadas en servicios
- ❌ Sidebar visible sin login

### ✅ Lo que se AGREGÓ
- ✅ Variables de entorno (`environment.ts`)
- ✅ HTTP Interceptor global (manejo de errores)
- ✅ Role Guard (protección por roles)
- ✅ LoginService mejorado (verificación de expiración)
- ✅ Flujo de autenticación real
- ✅ Sidebar condicional (solo si está logueado)

---

## 🎯 FLUJO DE USUARIO ACTUAL

```
1. Usuario accede a la app
   ↓
2. Redirigido a /login (si no está logueado)
   ↓
3. Ingresa email y contraseña
   ↓
4. Backend valida y devuelve token JWT
   ↓
5. Token guardado en sessionStorage
   ↓
6. Redirigido a /dashboard
   ↓
7. Sidebar y menú se muestran según su rol:
   - ADMIN: Ve usuarios, dashboard, etc.
   - CLIENTE: Ve transacciones, wallets, etc.
   ↓
8. Usuario navega por la app
   ↓
9. Si el token expira o hay error 401:
   - Logout automático
   - Redirigido a /login
```

---

## 🔧 CONFIGURACIÓN NECESARIA

### 1. Variables de Entorno

**Para Desarrollo** (`src/app/environment/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // ← Tu backend
  loginUrl: 'http://localhost:8080/login',
  allowedDomains: ['localhost:8080'],
  disallowedRoutes: [
    'http://localhost:8080/login',
    'http://localhost:8080/api/auth/register',
    'http://localhost:8080/api/auth/forgot-password'
  ]
};
```

**Para Producción** (`src/app/environment/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-servidor.com/api',  // ← Cambiar aquí
  loginUrl: 'https://tu-servidor.com/login',
  allowedDomains: ['tu-servidor.com'],
  disallowedRoutes: [
    'https://tu-servidor.com/login',
    'https://tu-servidor.com/api/auth/register',
    'https://tu-servidor.com/api/auth/forgot-password'
  ]
};
```

### 2. Token JWT Requerido

El backend debe devolver un token JWT con esta estructura:

```json
{
  "sub": "usuario@ejemplo.com",
  "roles": ["ADMIN"],  // o "role": "ADMIN"
  "userId": 123,
  "id": 123,
  "exp": 1234567890
}
```

**Campos importantes:**
- `sub` o `email` o `username`: Email del usuario
- `roles` o `role` o `authorities`: Rol(es) del usuario
- `userId` o `id`: ID del usuario
- `exp`: Timestamp de expiración

---

## 🚀 CÓMO EJECUTAR

### Desarrollo
```bash
cd c:\Users\USER\Desktop\FRONTEND
ng serve
```

Acceder a: `http://localhost:4200`

### Build de Producción
```bash
ng build --configuration production
```

---

## 🔐 ROLES Y PERMISOS

### Rutas Solo para ADMIN
```
/usuarios
/usuarios/nuevo
/usuarios/editar/:id
```

### Rutas para Todos los Usuarios Autenticados
```
/dashboard
/perfil
/transacciones
/planes
/metodos-pago
/wallets
/criptomonedas
/tipos-cambio
/notificaciones
/comercios
```

### Rutas Públicas
```
/login
```

---

## 🧪 CÓMO PROBAR

### 1. Probar Login
```
1. Abrir http://localhost:4200
2. Debe redirigir a /login
3. Ingresar credenciales
4. Debe redirigir a /dashboard
5. Sidebar debe aparecer
```

### 2. Probar Protección de Rutas
```
1. Loguearse como CLIENTE
2. Intentar acceder a /usuarios
3. Debe mostrar mensaje de error
4. Debe redirigir a /dashboard
```

### 3. Probar Expiración de Token
```
1. Loguearse
2. Esperar a que el token expire
3. Intentar hacer cualquier acción
4. Debe cerrar sesión automáticamente
5. Debe redirigir a /login
```

### 4. Probar Logout
```
1. Loguearse
2. Hacer clic en "Cerrar Sesión"
3. Sidebar debe desaparecer
4. Debe redirigir a /login
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: No puedo hacer login
**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la URL en `environment.ts`
3. Abre la consola del navegador (F12)
4. Revisa si hay errores de CORS

### Problema: El sidebar no aparece
**Solución:**
1. Verifica que el token se guardó en sessionStorage
2. Abre DevTools → Application → Session Storage
3. Debe haber una clave `token`

### Problema: Dice "No tiene permisos"
**Solución:**
1. Verifica el rol en el token JWT
2. Decodifica el token en jwt.io
3. Verifica que el campo `roles` o `role` exista
4. Verifica que coincida con el rol esperado

### Problema: Error 401 constantemente
**Solución:**
1. El token puede estar expirado
2. Verifica el campo `exp` en el token
3. Asegúrate de que el backend devuelva un token válido

---

## 📁 ARCHIVOS IMPORTANTES

```
FRONTEND/
├── src/app/
│   ├── environment/
│   │   ├── environment.ts          ← Configuración desarrollo
│   │   └── environment.prod.ts     ← Configuración producción
│   │
│   ├── interceptors/
│   │   └── auth.interceptor.ts     ← Manejo de errores HTTP
│   │
│   ├── guard/
│   │   ├── seguridad-guard.ts      ← Verifica autenticación
│   │   └── role.guard.ts           ← Verifica roles
│   │
│   ├── service/
│   │   └── login-service.ts        ← Servicio de autenticación
│   │
│   ├── app.component.ts            ← Lógica del sidebar
│   ├── app.component.html          ← Template del sidebar
│   ├── app.config.ts               ← Configuración global
│   └── app.routes.ts               ← Rutas y permisos
│
├── REFACTORIZACION_RESUMEN.md      ← Resumen completo
├── GUIA_IMPLEMENTACION_PENDIENTES.md ← Funcionalidades pendientes
├── README_REFACTORIZACION.md       ← Resumen ejecutivo
└── GUIA_RAPIDA.md                  ← Este archivo
```

---

## 📚 DOCUMENTACIÓN

1. **GUIA_RAPIDA.md** (este archivo)
   - Inicio rápido
   - Configuración básica
   - Solución de problemas

2. **REFACTORIZACION_RESUMEN.md**
   - Resumen completo de cambios
   - Estructura de archivos
   - Cómo usar las nuevas funcionalidades

3. **GUIA_IMPLEMENTACION_PENDIENTES.md**
   - Funcionalidades pendientes
   - Guías paso a paso
   - Código de ejemplo

4. **README_REFACTORIZACION.md**
   - Resumen ejecutivo
   - Estadísticas
   - Checklist de verificación

---

## ✅ CHECKLIST RÁPIDO

Antes de empezar a desarrollar:

- [ ] Backend corriendo en `http://localhost:8080`
- [ ] `environment.ts` configurado con la URL correcta
- [ ] Token JWT devuelve los campos correctos
- [ ] `ng serve` ejecutándose sin errores
- [ ] Puedes hacer login correctamente
- [ ] El sidebar aparece después del login
- [ ] Las rutas están protegidas correctamente

---

## 🎯 PRÓXIMOS PASOS

Ahora que la refactorización está completa, puedes:

1. **Implementar funcionalidades pendientes:**
   - Botón pagar cuotas
   - Validaciones asíncronas
   - Vista de detalle de wallet
   - Registro de usuarios
   - Recuperación de contraseña

2. **Mejorar la UI/UX:**
   - Agregar animaciones
   - Mejorar el diseño del login
   - Agregar página 404 personalizada

3. **Optimizar:**
   - Implementar lazy loading
   - Optimizar el bundle size
   - Agregar PWA

---

## 💡 TIPS

### Tip 1: Verificar el Token
```typescript
// En la consola del navegador
const token = sessionStorage.getItem('token');
console.log(token);

// Decodificar en jwt.io
```

### Tip 2: Ver el Rol del Usuario
```typescript
// En cualquier componente
constructor(private loginService: LoginService) {
  console.log('Es Admin?', this.loginService.isAdmin());
  console.log('Es Cliente?', this.loginService.isCliente());
  console.log('Rol:', this.loginService.showRole());
}
```

### Tip 3: Proteger una Nueva Ruta
```typescript
// En app.routes.ts
{
  path: 'mi-ruta',
  component: MiComponente,
  canActivate: [seguridadGuard, roleGuard],
  data: { roles: ['ADMIN'] }  // Solo admin
}
```

---

## 🆘 AYUDA

Si tienes problemas:

1. **Revisa la consola del navegador** (F12)
2. **Revisa la consola del servidor** (backend)
3. **Verifica las variables de entorno**
4. **Consulta la documentación** en los archivos .md

---

## ✨ ¡LISTO!

Tu aplicación ahora tiene:
- ✅ Autenticación real
- ✅ Protección por roles
- ✅ Manejo de errores profesional
- ✅ Configuración centralizada

**¡Empieza a desarrollar las funcionalidades de negocio!**

---

**Última actualización:** 27 de Noviembre de 2025  
**Estado:** ✅ LISTO PARA USAR
