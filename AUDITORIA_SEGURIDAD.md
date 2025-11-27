# 🛡️ Auditoría de Seguridad y Correcciones Frontend

Este documento detalla las vulnerabilidades detectadas y las acciones correctivas aplicadas en el Frontend, así como las recomendaciones pendientes para el Backend.

## ✅ Correcciones Aplicadas (Frontend)

### 1. Normalización de Roles (`LoginService`)
*   **Problema:** Inconsistencia entre `ROLE_ADMIN` (Backend) y `ADMIN` (Frontend).
*   **Solución:** Se modificó `LoginService.showRole()` para eliminar automáticamente el prefijo `ROLE_` del token JWT.
*   **Resultado:** `RoleGuard` y las verificaciones `isAdmin()` ahora funcionan correctamente independientemente de la convención del backend.

### 2. Eliminación de Rol en Registro (`RegistroComponent`)
*   **Problema:** El frontend enviaba `rolId: 2` explícitamente, lo cual es inseguro.
*   **Solución:** Se eliminó la asignación de `rolId` en el payload de registro.
*   **Estado:** Corregido. El backend debe ser responsable de asignar el rol por defecto.

### 3. Advertencia de Cálculo de Tasas (`TransaccionCrearComponent`)
*   **Problema:** El frontend calcula `montoTotalCripto` y `tasaAplicada` y los envía al backend. Esto permite manipulación de precios.
*   **Acción:** Se agregó una advertencia de seguridad (`SECURITY WARNING`) en el código.
*   **Recomendación:** No se puede corregir solo desde el frontend sin romper la API actual. Se requiere refactorización del Backend.

---

## ⚠️ Acciones Requeridas en Backend

Para cerrar completamente las brechas de seguridad, el equipo de Backend debe implementar lo siguiente:

### 1. Asignación Automática de Roles
*   El endpoint `/auth/register` debe ignorar cualquier campo `rolId` o `roles` que venga en el JSON.
*   Debe asignar forzosamente el rol `CLIENTE` (o `USUARIO`) en la lógica de negocio.

### 2. Centralización de Cálculos Financieros
*   El endpoint de creación de transacciones NO debe aceptar `tasaAplicada` ni `montoTotalCripto`.
*   Debe recibir solo `montoFiat` y `criptoId`.
*   El backend debe buscar la tasa vigente en su base de datos y realizar el cálculo `fiat / tasa` internamente para garantizar la integridad.

### 3. Validación de Propiedad (IDOR)
*   En endpoints como `GET /api/wallets/{id}`, validar que la wallet pertenezca al usuario autenticado (extraído del token).
*   Evitar confiar en IDs enviados por el cliente si el recurso es privado.

### 4. Manejo de Fechas
*   Asegurar que todas las fechas se reciban y almacenen en UTC.
