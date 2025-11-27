# 🔧 SOLUCIÓN DE PROBLEMAS - ERROR 401 LOGIN

## ❌ Error Actual

```
POST http://localhost:8080/login 401 (Unauthorized)
```

Este error significa que el **backend está rechazando las credenciales**. El frontend está funcionando correctamente.

---

## 🔍 DIAGNÓSTICO

### 1. Verificar que el Backend esté Corriendo

**Ejecutar el script de prueba:**
```powershell
cd c:\Users\USER\Desktop\FRONTEND
.\test-backend.ps1
```

Este script verificará:
- ✅ Si el backend está corriendo
- ✅ Si el endpoint `/login` existe
- ✅ Si las credenciales de prueba funcionan

---

## 🛠️ SOLUCIONES

### **Solución 1: Verificar Credenciales**

El error 401 generalmente significa que:
- ❌ El usuario no existe en la base de datos
- ❌ La contraseña es incorrecta
- ❌ El formato del request no coincide con el esperado

**¿Qué credenciales estás usando?**

Prueba con estas credenciales de ejemplo:
```
Email: admin@test.com
Password: admin123
```

Si no funcionan, necesitas:
1. Crear un usuario en la base de datos
2. Verificar qué usuarios existen actualmente

---

### **Solución 2: Verificar el DTO del Backend**

El frontend envía este JSON:
```json
{
  "email": "usuario@ejemplo.com",
  "passwordHash": "contraseña123"
}
```

**¿El backend espera este formato?**

Verifica en tu backend (Java) el `AuthRequestDTO`:

```java
// ¿Se ve así?
public class AuthRequestDTO {
    private String email;
    private String passwordHash;  // ← ¿O es "password"?
    
    // getters y setters
}
```

**Si el backend espera `password` en lugar de `passwordHash`:**

Necesitas actualizar el modelo en el frontend:

**Archivo:** `src/app/model/jwtRequest.ts`
```typescript
export interface JwtRequest {
  email: string;
  password: string;  // ← Cambiar de passwordHash a password
}
```

**Archivo:** `src/app/autenticador/autenticador.ts`
```typescript
// Línea 33: Cambiar
passwordHash: string = '';  // ← Cambiar a:
password: string = '';

// Línea 61: Cambiar
const request: JwtRequest = {
  email: this.email,
  password: this.password  // ← Cambiar de passwordHash
};
```

---

### **Solución 3: Verificar CORS**

Si el backend está en otro puerto o dominio, puede haber problemas de CORS.

**En el backend (Java/Spring Boot):**

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

### **Solución 4: Verificar la Base de Datos**

**Conectarse a la base de datos y verificar:**

```sql
-- Ver todos los usuarios
SELECT * FROM usuarios;

-- Ver usuario específico
SELECT * FROM usuarios WHERE email = 'admin@test.com';

-- Crear usuario de prueba (si no existe)
INSERT INTO usuarios (nombre, email, password_hash, rol_id, estado) 
VALUES ('Admin', 'admin@test.com', '$2a$10$...', 1, true);
```

**Nota:** La contraseña debe estar hasheada con BCrypt.

---

### **Solución 5: Verificar los Logs del Backend**

**En la consola del backend, busca:**

```
2025-11-27 14:50:58 ERROR [...] Authentication failed for user: admin@test.com
2025-11-27 14:50:58 ERROR [...] Bad credentials
```

Esto te dirá exactamente qué está fallando.

---

## 🧪 PRUEBAS MANUALES

### Opción 1: Usar Postman o Insomnia

**Request:**
```
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "passwordHash": "admin123"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "jwttoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta actual (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Bad credentials"
}
```

### Opción 2: Usar cURL (PowerShell)

```powershell
$body = @{
    email = "admin@test.com"
    passwordHash = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] El backend está corriendo en `http://localhost:8080`
- [ ] El endpoint `/login` existe y responde
- [ ] Existe un usuario en la base de datos
- [ ] La contraseña está correctamente hasheada
- [ ] El DTO del backend coincide con el del frontend
- [ ] CORS está configurado correctamente
- [ ] Los logs del backend no muestran errores

---

## 🔑 CREAR USUARIO DE PRUEBA

Si no tienes usuarios en la base de datos, necesitas crear uno.

### Opción 1: Desde el Backend (Recomendado)

**Crear un endpoint de registro temporal:**

```java
@PostMapping("/api/auth/register")
public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
    Usuario usuario = new Usuario();
    usuario.setEmail(dto.getEmail());
    usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
    usuario.setRol(rolRepository.findById(1L).orElseThrow());
    usuario.setEstado(true);
    
    usuarioRepository.save(usuario);
    return ResponseEntity.ok("Usuario creado");
}
```

**Luego desde el frontend o Postman:**
```json
POST http://localhost:8080/api/auth/register
{
  "email": "admin@test.com",
  "password": "admin123",
  "nombre": "Admin"
}
```

### Opción 2: Directamente en la Base de Datos

**Generar hash BCrypt:**

Usa una herramienta online: https://bcrypt-generator.com/

Contraseña: `admin123`
Hash: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

**Insertar en la base de datos:**
```sql
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, estado, fecha_registro) 
VALUES (
  'Admin', 
  'Sistema', 
  'admin@test.com', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  1,  -- ID del rol ADMIN
  true,
  NOW()
);
```

---

## 🎯 SIGUIENTE PASO

1. **Ejecuta el script de prueba:**
   ```powershell
   .\test-backend.ps1
   ```

2. **Revisa los logs del backend**

3. **Verifica la base de datos**

4. **Prueba con Postman/Insomnia**

5. **Si sigue fallando, comparte:**
   - Los logs del backend
   - El código del `AuthRequestDTO`
   - El código del `AuthController`
   - La estructura de la tabla `usuarios`

---

## 💡 NOTA IMPORTANTE

El error 401 es **NORMAL** si:
- No tienes usuarios creados en la base de datos
- Las credenciales son incorrectas
- El formato del request no coincide

**El frontend está funcionando correctamente.** Solo necesitas configurar el backend correctamente.

---

## 📞 ¿NECESITAS MÁS AYUDA?

Si después de seguir estos pasos el error persiste, comparte:

1. Los logs del backend (últimas 20 líneas)
2. El código del `AuthController` y `AuthRequestDTO`
3. La estructura de la tabla `usuarios` (SQL)
4. El resultado del script `test-backend.ps1`

¡Con esa información podré ayudarte mejor! 🚀
