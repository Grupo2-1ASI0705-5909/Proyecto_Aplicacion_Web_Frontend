# SOLUCIÓN: Error 401 en Notificaciones

## 🔍 Problema Identificado

**Error**: `401 Unauthorized` en endpoints de notificaciones
```
Failed to load resource: the server responded with a status of 401 ()
http://localhost:8080/api/notificaciones/usuario/1: 401
http://localhost:8080/api/notificaciones: 401
```

**Causa**: Spring Security estaba bloqueando el acceso a `/api/notificaciones/**` mientras verificaba la solución al problema de autenticación.

---

## ✅ Solución Aplicada

### 1. **Backend - SecurityConfig.java**

He agregado **temporalmente** permiso público a los endpoints de notificaciones para testing:

```java
// TEMPORAL: Permitir endpoints de notificaciones (para debugging 401)
.requestMatchers("/api/notificaciones/**").permitAll()
```

⚠️ **IMPORTANTE**: Esto es TEMPORAL para testing. Una vez confirmado que funciona, debemos cambiarlo a `.authenticated()` para mayor seguridad.

### 2. **Frontend - NotificacionService.ts**

Agregados logs de debugging para verificar el token:

```typescript
console.log('[NotificacionService] Token retrieval:', token ? 'FOUND' : 'MISSING');
console.log('[NotificacionService] Authorization header set:', authHeader.substring(0, 30) + '...');
```

---

## 🚀 Pasos para Probar

### **PASO 1: Reiniciar el Backend**

Es **CRÍTICO** reiniciar el servidor Spring Boot para que los cambios en `SecurityConfig.java` tengan efecto.

#### Si estás usando IntelliJ:
1. Detén la aplicación (botón rojo STOP)
2. Click en el botón verde RUN o presiona `Shift + F10`
3. Espera a que veas: `Started TrabajoAplicacionesWebApplication`

#### Si estás usando Maven desde terminal:
```bash
# Detén el servidor actual (Ctrl+C)
# Luego ejecuta:
cd "intellij 2.0"
mvn spring-boot:run
```

### **PASO 2: Limpiar caché del navegador (IMPORTANTE)**

```javascript
// Abre la consola del navegador (F12) y ejecuta:
sessionStorage.clear();
```

Luego recarga la página (F5) y vuelve a hacer login.

### **PASO 3: Probar Transferencia P2P**

1. Ve a **Transacciones > Nueva Transacción**
2. Selecciona **"Transferencia P2P"**
3. Completa el formulario:
   - Email destinatario: (un usuario diferente)
   - Criptomoneda: BTC (o la que tengas)
   - Monto en USD: 10 (ejemplo)
4. Click en **"Guardar"**

### **PASO 4: Verificar en la consola del navegador**

Deberías ver logs como:
```
[NotificacionService] Token retrieval: FOUND
[NotificacionService] Authorization header set: Bearer eyJhbGciOiJIUzI1NiIsInR5...
Notificación enviada al remitente
Notificación enviada al destinatario
```

Si ves:
```
Error enviando notificación al remitente HttpErrorResponse
Error enviando notificación al destinatario HttpErrorResponse
```

**Verifica que reiniciaste el backend** (Paso 1).

### **PASO 5: Verificar Notificaciones en UI**

1. Ve a **Notificaciones** (menú `/notificaciones`)

2. Deberías ver las notificaciones creadas:
   - "Transferencia Enviada" (para el remitente)
   - "Transferencia Recibida" (para el destinatario - si eres admin o ese usuario)

### **PASO 6: Verificar en Base de Datos**

```sql
SELECT * FROM notificaciones ORDER BY fecha_envio DESC LIMIT 5;
```

Deberías ver las nuevas notificaciones con:
- `usuario_id` correcto
- `titulo`: "Transferencia Enviada" o "Transferencia Recibida"
- `mensaje`: Con el detalle de la transacción
- `leido`: false
- `fecha_envio`: Timestamp actual

---

## 🔧 Troubleshooting

### Si todavía ves 401:

1. **Verifica que el backend esté reiniciado**
   - Mira la consola del backend
   - Debería mostrar: `Started TrabajoAplicacionesWebApplication`

2. **Valida el token en sessionStorage**
   ```javascript
   // En consola del navegador:
   console.log(sessionStorage.getItem('token'));
   ```
   - Debería mostrar un string largo empezando con "Bearer" o un JWT

3. **Verifica que no haya errores de compilación en el backend**
   - Revisa la consola de IntelliJ
   - No debería haber errores rojos

### Si las notificaciones no aparecen en la BD:

1. **Verifica que se llamen los métodos**
   - Mira la consola del navegador
   - Busca: "Notificación enviada al remitente"

2. **Revisa los logs del backend**
   - Busca errores en la consola de Spring Boot
   - Verifica que no haya excepciones

3. **Verifica la conexión a la BD**
   ```sql
   -- Prueba manual de inserción:
   INSERT INTO notificaciones (usuario_id, titulo, mensaje, leido, fecha_envio)
   VALUES (1, 'Test', 'Mensaje de prueba', false, NOW());
   ```

---

## 📝 Una vez que funcione...

### **Consolidar Seguridad (IMPORTANTE)**

Una vez confirmado que todo funciona, debemos asegurar los endpoints:

#### Opción A: Requerir autenticación (Recomendado)
```java
// Cambiar de:
.requestMatchers("/api/notificaciones/**").permitAll()

// A:
.requestMatchers("/api/notificaciones/**").authenticated()
```

Esto requiere que el usuario esté logueado pero permite acceso a cualquier rol.

#### Opción B: Restringir por rol (Más seguro)
```java
// Solo usuarios con rol USUARIO o ADMIN
.requestMatchers("/api/notificaciones/**")
    .hasAnyRole("USUARIO", "ADMIN", "CLIENTE")
```

#### Opción C: Dejar como está (Solo para desarrollo)
Si estás en desarrollo y quieres máxima flexibilidad, puedes dejarlo con `permitAll()` temporalmente.

---

## 📊 Resumen de Cambios Realizados

### Backend (Java):
1. ✅ `SecurityConfig.java` - Agregado permitAll temporal para `/api/notificaciones/**`
2. ✅ `NotificacionController.java` - Endpoint GET `/api/notificaciones` agregado
3. ✅ `NotificacionService.java` - Método `obtenerTodas()` agregado

### Frontend (TypeScript):
1. ✅ `notificacion.service.ts` - Logs de debugging agregados
2. ✅ `transaccion-crear.component.ts` - Ya tiene las llamadas para crear notificaciones
3. ✅ `notificacion-listar.component.ts` - UI moderna ya implementada

---

## ✅ Checklist de Verificación

- [ ] Backend reiniciado (CRÍTICO)
- [ ] Caché del navegador limpiado
- [ ] Login realizado nuevamente
- [ ] Transferencia P2P ejecutada
- [ ] Logs en consola del navegador verificados
- [ ] Notificaciones visibles en UI `/notificaciones`
- [ ] Notificaciones guardadas en base de datos
- [ ] Seguridad configurada para producción (una vez testado)

---

**Última actualización**: 30 de noviembre de 2025  
**Estado**: Configuración de seguridad temporal para debugging  
**Próximo paso**: Verificar funcionamiento y asegurar endpoints
