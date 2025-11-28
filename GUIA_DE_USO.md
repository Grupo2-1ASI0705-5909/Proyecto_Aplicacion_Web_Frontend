# 📘 Guía de Uso - PulsePay

## 🎯 Descripción del Sistema
PulsePay es una plataforma de pagos con criptomonedas que permite a usuarios realizar transacciones, gestionar wallets digitales y realizar pagos a comercios.

---

## 👥 Roles del Sistema

### 1. **ADMINISTRADOR**
Control total del sistema.

**Funcionalidades:**
- ✅ Ver dashboard con estadísticas globales
- ✅ Gestionar usuarios (crear, editar, activar/desactivar)
- ✅ Gestionar comercios (ver todos, aprobar, editar)
- ✅ Ver todas las transacciones del sistema
- ✅ Gestionar criptomonedas (agregar, editar)
- ✅ Actualizar tipos de cambio

**Menú:**
- Dashboard
- Usuarios
- Comercios
- Transacciones
- Criptomonedas
- Tipos de Cambio

---

### 2. **COMERCIO**
Recibe pagos de clientes.

**Funcionalidades:**
- ✅ Ver dashboard con resumen de ventas
- ✅ Ver historial de transacciones (ventas recibidas)
- ✅ Editar información de su comercio
- ✅ Ver notificaciones de pagos

**Menú:**
- Inicio (Dashboard de ventas)
- Mi Perfil
- Mis Ventas (Transacciones)
- Mi Comercio
- Notificaciones

**Limitaciones:**
- ❌ No puede crear wallets
- ❌ No puede realizar pagos
- ❌ Solo ve transacciones donde es el receptor

---

### 3. **CLIENTE (USUARIO)**
Realiza pagos a comercios.

**Funcionalidades:**
- ✅ Ver dashboard con saldo total
- ✅ Crear y gestionar wallets de criptomonedas
- ✅ Realizar pagos a comercios
- ✅ Ver historial de pagos realizados
- ✅ Crear planes de pago (cuotas)
- ✅ Gestionar métodos de pago
- ✅ Consultar criptomonedas disponibles
- ✅ Ver tipos de cambio actuales
- ✅ Recibir notificaciones

**Menú:**
- Inicio (Dashboard)
- Mi Perfil
- Mis Wallets
- Mis Pagos (Transacciones)
- Planes de Pago
- Métodos de Pago
- Criptomonedas (solo consulta)
- Tipos de Cambio (solo consulta)
- Notificaciones

**Limitaciones:**
- ❌ No puede ver usuarios del sistema
- ❌ No puede crear/editar criptomonedas
- ❌ Solo ve sus propias transacciones

---

## 🚀 Flujo de Uso

### **Para CLIENTES:**

#### 1. Registro
1. Ir a `/registro`
2. Completar formulario (nombre, apellido, email, teléfono, contraseña)
3. El sistema asigna automáticamente rol "USUARIO"

#### 2. Crear Wallet
1. Login → Dashboard
2. Click en "Mis Wallets" → "Nueva Wallet"
3. Seleccionar criptomoneda (BTC, ETH, USDT, etc.)
4. Ingresar dirección de wallet
5. Guardar

#### 3. Realizar Pago
1. Ir a "Mis Pagos" → "Nueva Transacción"
2. Seleccionar:
   - Comercio destino
   - Método de pago
   - Monto en fiat (USD, PEN, etc.)
   - Criptomoneda a usar
3. El sistema calcula automáticamente el monto en cripto según tipo de cambio
4. Confirmar transacción

#### 4. Ver Historial
1. Ir a "Mis Pagos"
2. Filtrar por fecha o estado (Completada, Pendiente, Fallida)

---

### **Para COMERCIOS:**

#### 1. Registro
1. El ADMIN crea el usuario con rol "COMERCIO"
2. Login con credenciales

#### 2. Configurar Comercio
1. Ir a "Mi Comercio"
2. Completar:
   - Nombre comercial
   - RUC
   - Categoría
   - Dirección
   - Wallet de recepción
3. Guardar

#### 3. Recibir Pagos
1. Los clientes seleccionan tu comercio al pagar
2. Recibes notificación
3. Ver detalles en "Mis Ventas"

#### 4. Ver Estadísticas
1. Dashboard muestra:
   - Total de ventas (en fiat)
   - Total recibido (en cripto)
   - Últimas 5 transacciones

---

### **Para ADMINISTRADORES:**

#### 1. Gestionar Usuarios
1. Ir a "Usuarios"
2. Crear nuevo usuario:
   - Asignar rol (ADMINISTRADOR, COMERCIO, USUARIO)
   - Activar/Desactivar cuentas
3. Editar información

#### 2. Gestionar Criptomonedas
1. Ir a "Criptomonedas" → "Nueva"
2. Ingresar:
   - Código (BTC, ETH, etc.)
   - Nombre
   - Decimales
   - Símbolo
3. Guardar

#### 3. Actualizar Tipos de Cambio
1. Ir a "Tipos de Cambio" → "Nuevo"
2. Seleccionar par (ej: USD → BTC)
3. Ingresar tasa actual
4. Guardar (se registra con fecha/hora)

---

## 🔐 Seguridad Implementada

### Autenticación
- ✅ JWT con expiración de 7 horas
- ✅ Contraseñas encriptadas con BCrypt
- ✅ Interceptor que maneja errores 401/403

### Autorización
- ✅ Guards en rutas (solo acceso con rol correcto)
- ✅ Validación en Backend con `@PreAuthorize`
- ✅ Usuarios solo ven sus propios datos (IDOR protegido)

### Validaciones
- ✅ Email único (validación asíncrona)
- ✅ RUC único para comercios
- ✅ Solo se pueden eliminar transacciones PENDIENTES
- ✅ Usuarios no pueden eliminar transacciones de otros

---

## 📊 Datos de Ejemplo

### Usuarios de Prueba
```
ADMIN:
- Email: admin@pulsepay.com
- Password: admin123
- Rol: ADMINISTRADOR

COMERCIO:
- Email: comercio@tienda.com
- Password: comercio123
- Rol: COMERCIO

CLIENTE:
- Email: cliente@gmail.com
- Password: cliente123
- Rol: USUARIO
```

### Criptomonedas Iniciales
- BTC (Bitcoin) - 8 decimales
- ETH (Ethereum) - 18 decimales
- USDT (Tether) - 6 decimales

---

## 🌐 Despliegue en Firebase

### Backend (Spring Boot)
1. Compilar: `mvn clean package`
2. Subir JAR a Firebase Hosting o Cloud Run
3. Configurar variables de entorno:
   - `jwt.secret=tu_clave_secreta`
   - Base de datos (MySQL/PostgreSQL)

### Frontend (Angular)
1. Compilar: `ng build --configuration production`
2. Subir carpeta `dist/` a Firebase Hosting:
   ```bash
   firebase login
   firebase init hosting
   firebase deploy
   ```

### Variables de Entorno
Actualizar `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.com/api',
  loginUrl: 'https://tu-backend.com/login',
  allowedDomains: ['tu-backend.com'],
  disallowedRoutes: [
    'https://tu-backend.com/login',
    'https://tu-backend.com/api/usuarios'
  ]
};
```

---

## 📈 Capacidad del Sistema

**Optimizado para:**
- ✅ 10 usuarios concurrentes
- ✅ ~100 transacciones/día
- ✅ Base de datos ligera (MySQL)
- ✅ Hosting compartido o Firebase

**Rendimiento:**
- Tiempo de respuesta: < 500ms
- Tamaño del bundle: ~2MB
- Compatible con navegadores modernos

---

## 🐛 Solución de Problemas

### "Sesión expirada"
- **Causa:** Token JWT expiró (7 horas)
- **Solución:** Volver a iniciar sesión

### "No tiene permisos"
- **Causa:** Intentando acceder a ruta sin rol correcto
- **Solución:** Verificar que tu usuario tenga el rol adecuado

### "Email ya registrado"
- **Causa:** El email ya existe en el sistema
- **Solución:** Usar otro email o recuperar contraseña

### Transacción no se puede eliminar
- **Causa:** Solo se pueden eliminar transacciones PENDIENTES
- **Solución:** Las transacciones completadas son permanentes

---

## 📞 Soporte

Para dudas o problemas:
1. Revisar esta guía
2. Verificar logs del navegador (F12 → Console)
3. Contactar al administrador del sistema

---

**Versión:** 1.0  
**Última actualización:** Noviembre 2025
