# 🔍 DEBUGGING DASHBOARD - PASO A PASO

## 📋 CHECKLIST DE VERIFICACIÓN

### 1️⃣ Abrir el Dashboard
```
URL: http://localhost:4200/
Ir a: Menú → Inicio (Dashboard)
```

### 2️⃣ Abrir Consola del Navegador
```
Presiona: F12
Tab: Console
```

### 3️⃣ Verificar los Logs

Deberías ver algo como esto:

```javascript
[DASHBOARD] Cargando datos para usuario: 3
[DASHBOARD] Usuario CLIENTE - Cargando wallets y transacciones
[DASHBOARD] Wallets cargadas: 3
[DASHBOARD] Transacciones totales del usuario: 25
[DASHBOARD] Filtrando transacciones del día: 2025-11-30T00:00:00.000Z
[DASHBOARD] ✅ Transacción del día: 45 2025-11-30T15:30:00.000Z
[DASHBOARD] ✅ Transacción del día: 48 2025-11-30T18:20:00.000Z
[DASHBOARD] 2 de 25 transacciones son del día de hoy
[DASHBOARD] Tasas recibidas: 5
[DASHBOARD] BTC: 1039.41 × $95000.50 = $98745495.05
[DASHBOARD] ETH: 123 × $3200.00 = $393600.00
[DASHBOARD] USDT: 12 × $1.00 = $12.00
[DASHBOARD] Patrimonio total calculado: $ 99139107.05
```

---

## ❌ ESCENARIO 1: No aparece NINGÚN log

**Problema:** El dashboard no se está cargando

**Solución:**
1. Verificar que estás en la ruta correcta: `/dashboard` o `/inicio`
2. Refrescar con `Ctrl + Shift + R`
3. Verificar que el componente está en el routing

---

## ❌ ESCENARIO 2: Aparece "No hay usuario logueado"

**Problema:** loginService.getUsuarioId() retorna null

**Solución:**
1. Verificar que hayas iniciado sesión
2. Revisar localStorage: `localStorage.getItem('token')`
3. Re-login

---

## ❌ ESCENARIO 3: "Wallets cargadas: 0"

**Problema:** El usuario no tiene wallets

**Solución:**
1. Ir a "Mis Wallets"
2. Crear al menos UNA wallet
3. Volver al Dashboard
4. Refrescar

---

## ❌ ESCENARIO 4: "Transacciones totales del usuario: 0"

**Problema:** El usuario no tiene transacciones

**Solución:**
1. Ir a "Transacciones" → "Nueva"
2. Crear una transacción
3. Volver al Dashboard
4. Debería aparecer en "Actividad Reciente"

---

## ❌ ESCENARIO 5: "0 de 25 transacciones son del día de hoy"

**Problema:** Tienes transacciones pero no son de HOY

**Explicación:** 
- El filtro solo muestra transacciones de HOY (2025-11-30)
- Si tus transacciones son de ayer o días anteriores, NO aparecerán

**Solución:**
1. Crear una transacción NUEVA hoy
2. O cambiar la fecha de una transacción existente en la BD

---

## ❌ ESCENARIO 6: "Tasas recibidas: 0" o no aparece

**Problema:** El backend no tiene tasas de cambio

**Solución:**
```sql
-- Verificar que existan tasas en la BD:
SELECT * FROM tipo_cambio ORDER BY fecha_hora DESC LIMIT 10;

-- Si no hay, insertar algunas:
INSERT INTO tipo_cambio (desde_codigo, hasta_codigo, tasa, fecha_hora, fuente)
VALUES 
  ('BTC', 'USD', 95000.50, NOW(), 'CoinGecko'),
  ('ETH', 'USD', 3200.00, NOW(), 'CoinGecko'),
  ('USDT', 'USD', 1.00, NOW(), 'CoinGecko');
```

---

## ✅ ESCENARIO CORRECTO: Todo funciona

```javascript
[DASHBOARD] Cargando datos para usuario: 3
[DASHBOARD] Usuario CLIENTE - Cargando wallets y transacciones
[DASHBOARD] Wallets cargadas: 3
[DASHBOARD] Transacciones totales del usuario: 25
[DASHBOARD] Filtrando transacciones del día: 2025-11-30T00:00:00.000Z
[DASHBOARD] 3 de 25 transacciones son del día de hoy
[DASHBOARD] Tasas recibidas: 5
[DASHBOARD] BTC: 1039.41 × $95000.50 = $98745495.05
[DASHBOARD] Patrimonio total calculado: $ 99139107.05
```

**Dashboard debe mostrar:**
- Mi Patrimonio: $99,139,107.05
- Actividad Reciente: 3 transacciones de hoy

---

## 🧪 PRUEBA RÁPIDA

### Crear Transacción de Prueba HOY

1. Ir a "Transacciones" → "Nueva"
2. Llenar el formulario:
   - Tipo: Pago a comercio
   - Cripto: BTC
   - Monto: 0.01
   - Comercio: Cualquiera
3. Confirmar
4. Volver al Dashboard
5. **DEBE aparecer en "Actividad Reciente"**

---

## 📊 COMPARACIÓN: Dashboard vs Wallet-Listar

| Característica | Wallet-Listar | Dashboard | ¿Funciona? |
|----------------|---------------|-----------|------------|
| Calcula patrimonio con tasas en vivo | ✅ | ✅ | |
| Se suscribe a tasasEnTiempoReal$ | ✅ | ✅ | |
| Multiplica saldo × tasa | ✅ | ✅ | |
| Muestra logs en consola | ✅ | ✅ | |
| Filtra transacciones por día | ❌ | ✅ | |

---

## 🆘 SI NADA FUNCIONA

**Copia y pega EXACTAMENTE lo que aparece en la consola (F12) aquí:**

```
[Pega los logs aquí]
```

**También necesito saber:**
1. ¿Eres usuario CLIENTE, ADMIN o COMERCIO?
2. ¿Cuántas wallets tienes?
3. ¿Cuántas transacciones tienes?
4. ¿Alguna transacción es de HOY (2025-11-30)?

---

## 🎯 RESUMEN EJECUTIVO

El código está CORRECTO. La lógica es IDÉNTICA a wallet-listar que funciona.

**Si no funciona, es porque:**
1. No eres usuario CLIENTE → Solo clientes ven "Mi Patrimonio"
2. No tienes wallets → Ir a crear wallets
3. No tienes transacciones de HOY → Crear una transacción nueva
4. No hay tasas en el backend → Verificar tabla tipo_cambio

**Los logs de la consola te dirán EXACTAMENTE cuál es el problema.**
