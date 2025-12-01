# Plan de Implementación - Correcciones y Mejoras

## 📋 Resumen de Cambios Solicitados

### 1. ✅ Cálculo del Patrimonio Total (USD)
**Problema**: Solo suma cantidades de cripto, sin considerar valor en USD
**Solución**: Multiplicar saldo de cada wallet por la tasa de cambio actual

**Afecta**:
- `dashboard.component.ts` (Inicio/Patrimonio)
- `wallet-listar.component.ts` (Mis Wallets)
- Backend: Posiblemente necesitamos endpoint para obtener tasas de cambio

---

### 2. ✅ Actividad Reciente - Filtro por Día Actual
**Problema**: Muestra todas las transacciones
**Solución**: Filtrar solo transacciones del día en curso

**Afecta**:
- `dashboard.component.ts` o componente de actividad reciente
- Filtro por fecha: `fecha >= hoy 00:00:00 AND fecha <= hoy 23:59:59`

---

### 3. ✅ Gestión de Wallets

#### 3.1. Creación de Wallet
**Cambios**:
- ❌ Eliminar campo "Monto Inicial"
- ✅ Saldo inicial siempre = 0
- ✅ Generar dirección aleatoria automáticamente (formato según red)

#### 3.2. Eliminación de Wallet
**Regla**: Solo permitir si `saldo === 0`
**Implementación**: Validación frontend + backend

#### 3.3. Edición de Wallet
**Regla**: Wallets NO modificables (deshabilitar edición completamente)

**Afecta**:
- `wallet-crear.component.ts` / `.html`
- `wallet-listar.component.ts`
- Backend: `WalletController`, `WalletService`

---

### 4. ✅ Notificaciones al Pagar a Comercio
**Acción**: Cuando se realiza un pago a comercio, crear notificación para el usuario

**Afecta**:
- `transaccion-crear.component.ts` (después del pago exitoso)
- Backend: Crear notificación en `NotificacionService`

---

### 5. ✅ Historial de Pagos - Columna "Destino"

**Cambios**:
- Renombrar: "Comercio destino" → "Destino"
- **Lógica**:
  - Si es comercio: Mostrar `comercio.nombre`
  - Si es P2P (usuario): Mostrar `usuario.nombre + usuario.apellido`

**Afecta**:
- `transaccion-listar.component.ts` / `.html`
- Posiblemente necesitamos información del destinatario en la respuesta

---

## 🔍 Archivos a Analizar

### Frontend
1. `/component/dashboard/` - Patrimonio e inicio
2. `/component/finanzas/wallet-crear/` - Creación wallet
3. `/component/finanzas/wallet-listar/` - Listado y eliminación
4. `/component/operaciones/transaccion-crear/` - Notificación pago
5. `/component/operaciones/transaccion-listar/` - Historial

### Backend
1. `WalletController.java` - Validaciones
2. `WalletService.java` - Lógica de negocio
3. `TransaccionService.java` - Notificaciones
4. `CriptomonedaService.java` - Tasas de cambio

---

## 📊 Prioridad de Implementación

1. **PRIMERO**: Wallets (creación, edición, eliminación) - Base del sistema
2. **SEGUNDO**: Patrimonio en USD - Visualización crítica
3. **TERCERO**: Historial "Destino" - UX importante
4. **CUARTO**: Actividad reciente filtro - Mejora UI
5. **QUINTO**: Notificación pago comercio - Feature adicional

---

## ⚠️ Decisiones Técnicas Pendientes

### Generación de Direcciones de Wallet
**Formatos por Red**:
- Bitcoin: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` (Base58, 26-35 chars)
- Ethereum: `0x71C7656EC7ab88b098defB751B7401B5f6d8976F` (Hex, 42 chars)
- Otros: Formato específico

**¿Cómo generar?**:
- Opción A: Backend genera con algoritmo (más seguro)
- Opción B: Frontend genera UUID + formato (más simple)
- **Recomendación**: Backend genera según red de la cripto

### Tasas de Cambio
**¿De dónde obtener?**:
- Opción A: API externa (CoinGecko, CoinMarketCap) - Datos reales
- Opción B: Tabla en BD con tasas actualizadas manualmente - Más simple
- Opción C: Campo `precioUSD` en tabla `criptomonedas` - Ya existe?
- **Recomendación**: Revisar si existe campo en BD

---

## 🚀 Próximo Paso

Analizar archivos específicos para entender estructura actual y comenzar implementación.
