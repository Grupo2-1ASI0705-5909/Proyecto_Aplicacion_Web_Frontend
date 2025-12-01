# 🚀 IMPLEMENTACIÓN DE MEJORAS - PASO A PASO

## 📝 ÍNDICE DE CAMBIOS

1. [**Agregar campo precioUSD a Criptomoneda**](#1-precio-usd-criptomoneda)
2. [**Modificar creación de Wallets**](#2-wallet-creacion)
3. [**Validar eliminación de Wallets**](#3-wallet-eliminacion)
4. [**Deshabilitar edición de Wallets**](#4-wallet-edicion)
5. [**Calcular patrimonio en USD**](#5-patrimonio-usd)
6. [**Filtrar actividad reciente por día**](#6-actividad-dia)
7. [**Notificación al pagar comercio**](#7-notificacion-pago)
8. [**Renombrar columna Destino en historial**](#8-historial-destino)

---

## 1️⃣ PRECIO USD CRIPTOMONEDA

### Backend - Agregar campo a Criptomoneda

**Archivo**: `intellij 2.0/src/main/java/org/upc/trabajo_aplicaciones_web/model/Criptomoneda.java`

```java
@Column(nullable = false, precision = 18, scale = 2)
private BigDecimal precioUSD = BigDecimal.ZERO;
```

**Migración SQL**:
```sql
ALTER TABLE criptomonedas 
ADD COLUMN preciousd DECIMAL(18,2) NOT NULL DEFAULT 0.00;

-- Insertar precios iniciales (ejemplo)
UPDATE criptomonedas SET preciousd = 45000.00 WHERE codigo = 'BTC';
UPDATE criptomonedas SET preciousd = 3200.00 WHERE codigo = 'ETH';
UPDATE criptomonedas SET preciousd = 1.00 WHERE codigo = 'USDT';
```

**DTO**: Agregar a `CriptomonedaDTO.java`
```java
private BigDecimal precioUSD;
```

---

## 2️⃣ WALLET CREACIÓN

### Backend - Generar dirección automáticamente

**Archivo**: `WalletService.java` - Modificar método `crear()`

```java
public WalletDTO crear(WalletDTO walletDTO) {
    // ... validaciones existentes ...
    
    Wallet wallet = new Wallet();
    wallet.setUsuario(usuario);
    wallet.setCriptomoneda(criptomoneda);
    
    // ✅ GENERAR DIRECCIÓN AUTOMÁTICAMENTE
    wallet.setDireccion(generarDireccion(criptomoneda));
    
    // ✅ SALDO SIEMPRE CERO AL CREAR
    wallet.setSaldo(BigDecimal.ZERO);
    
    wallet.setEstado(true);
    wallet = walletRepository.save(wallet);
    return convertirAWalletDTO(wallet);
}

// ✅ NUEVO MÉTODO: Generar dirección según red
private String generarDireccion(Criptomoneda cripto) {
    String codigo = cripto.getCodigo().toUpperCase();
    String uuid = UUID.randomUUID().toString().replace("-", "");
    
    switch (codigo) {
        case "BTC":
            // Bitcoin: 1 + 32 chars base58
            return "1" + uuid.substring(0, 32);
        case "ETH":
        case "USDT":
        case "USDC":
            // Ethereum: 0x + 40 chars hex
            return "0x" + uuid.substring(0, 40);
        case "BNB":
            // Binance: bnb + 39 chars
            return "bnb" + uuid.substring(0, 39);
        default:
            // Genérico
            return cripto.getCodigo().toLowerCase() + "_" + uuid.substring(0, 35);
    }
}
```

### Frontend - Remover campo saldo y dirección

**Archivo**: `wallet-crear.component.ts`

```typescript
constructor(private fb: FormBuilder, ...) {
  this.form = this.fb.group({
    criptoId: ['', Validators.required],
    // ❌ ELIMINADOS: direccion y saldo
    estado: [true],
    usuarioId: ['']
  });
}
```

**Archivo**: `wallet-crear.component.html`

Eliminar:
```html
<!-- ❌ ELIMINAR estos campos -->
<mat-form-field>
  <mat-label>Dirección</mat-label>
  <input formControlName="direccion">
</mat-form-field>

<mat-form-field>
  <mat-label>Saldo Inicial</mat-label>
  <input formControlName="saldo">
</mat-form-field>
```

---

## 3️⃣ WALLET ELIMINACIÓN

### Backend - Validar saldo > 0

**Archivo**: `WalletService.java`

```java
public void eliminar(Long id) {
    Wallet wallet = walletRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
    
    // ✅ VALIDAR SALDO CERO
    if (wallet.getSaldo().compareTo(BigDecimal.ZERO) > 0) {
        throw new RuntimeException("No se puede eliminar una wallet con saldo positivo. Saldo actual: " + wallet.getSaldo());
    }
    
    walletRepository.deleteById(id);
}
```

### Frontend - Validar antes de eliminar

**Archivo**: `wallet-listar.component.ts`

```typescript
eliminar(wallet: Wallet) {
  // ✅ VALIDAR SALDO
  if (wallet.saldo && wallet.saldo > 0) {
    this.snackBar.open('No puedes eliminar una wallet con saldo positivo', 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    return;
  }
  
  if (confirm(`¿Eliminar wallet de ${wallet.criptomoneda?.nombre}?`)) {
    this.walletService.eliminar(wallet.walletId!).subscribe(() => {
      this.snackBar.open('Wallet eliminada', 'Cerrar', { duration: 3000 });
      this.cargarWallets();
    });
  }
}
```

**Archivo**: `wallet-listar.component.html`

```html
<button 
  mat-icon-button 
  color="warn" 
  (click)="eliminar(wallet)"
  [disabled]="wallet.saldo > 0"
  [matTooltip]="wallet.saldo > 0 ? 'No puedes eliminar wallet con saldo' : 'Eliminar wallet'">
  <mat-icon>delete</mat-icon>
</button>
```

---

## 4️⃣ WALLET EDICIÓN

### Frontend - Deshabilitar completamente

**Archivo**: `wallet-listar.component.html`

```html
<!-- ❌ ELIMINAR botón de editar completamente -->
<!-- <button (click)="editar(wallet)">Editar</button> -->
```

**Archivo**: Eliminar ruta de edición en `app.routes.ts` si existe:

```typescript
// ❌ ELIMINAR:
// { path: 'wallets/editar/:id', component: WalletCrearComponent }
```

---

## 5️⃣ PATRIMONIO EN USD

### Backend - Nuevo endpoint

**Archivo**: `WalletService.java`

```java
public BigDecimal calcularPatrimonioUSD(Long usuarioId) {
    List<Wallet> wallets = walletRepository.findByUsuarioUsuarioId(usuarioId);
    
    BigDecimal patrimonioTotal = BigDecimal.ZERO;
    
    for (Wallet wallet : wallets) {
        BigDecimal saldoCripto = wallet.getSaldo();
        BigDecimal precioUSD = wallet.getCriptomoneda().getPrecioUSD();
        BigDecimal valorUSD = saldoCripto.multiply(precioUSD);
        patrimonioTotal = patrimonioTotal.add(valorUSD);
    }
    
    return patrimonioTotal;
}
```

**Archivo**: `WalletController.java`

```java
@GetMapping("/patrimonio/{usuarioId}")
public ResponseEntity<BigDecimal> obtenerPatrimonio(@PathVariable Long usuarioId) {
    BigDecimal patrimonio = walletService.calcularPatrimonioUSD(usuarioId);
    return ResponseEntity.ok(patrimonio);
}
```

### Frontend - Dashboard

**Archivo**: `dashboard.component.ts`

```typescript
cargarKPIs() {
  if (!this.usuarioIdActual) return;
  
  if (this.isAdmin) {
    // Admin: Total usuarios
    this.usuarioService.contarUsuariosActivos().subscribe(
      count => this.totalUsuarios = count
    );
  } else {
    // Cliente: Patrimonio en USD
    this.walletService.obtenerPatrimonioUSD(this.usuarioIdActual).subscribe(
      patrimonio => this.saldoTotal = patrimonio
    );
  }
  
  // Transacciones recientes
  this.cargarTransaccionesRecientes();
}
```

**Archivo**: `wallet.service.ts`

```typescript
obtenerPatrimonioUSD(usuarioId: number): Observable<number> {
  return this.http.get<number>(`${this.url}/patrimonio/${usuarioId}`, 
    { headers: this.getHeaders() });
}
```

**Archivo**: `dashboard.component.html`

```html
<div class="kpi-card patrimonio">
  <h3>Patrimonio Total</h3>
  <p class="kpi-value">{{ saldoTotal | currency:'USD':'symbol':'1.2-2' }}</p>
  <mat-icon>account_balance_wallet</mat-icon>
</div>
```

---

## 6️⃣ ACTIVIDAD DÍA ACTUAL

**Archivo**: `dashboard.component.ts`

```typescript
cargarTransaccionesRecientes() {
  if (!this.usuarioIdActual) return;
  
  this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(
    data => {
      // ✅ FILTRAR POR HOY
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      this.transaccionesRecientes = data.filter(tx => {
        const fechaTx = new Date(tx.fechaTransaccion);
        fechaTx.setHours(0, 0, 0, 0);
        return fechaTx.getTime() === hoy.getTime();
      }).slice(0, 5); // Solo las 5 más recientes
    }
  );
}
```

---

## 7️⃣ NOTIFICACIÓN PAGO COMERCIO

**Archivo**: `transaccion-crear.component.ts`

```typescript
realizarPago() {
  // ... código existente ...
  
  this.transaccionService.crear(transaccion).subscribe({
    next: (response) => {
      this.snackBar.open('Pago realizado con éxito', 'Cerrar', {
        duration: 3000
      });
      
      // ✅ CREAR NOTIFICACIÓN
      if (this.esComercio && this.comercioDestinoId) {
        this.crearNotificacionPagoComercio(response);
      }
      
      this.router.navigate(['/transacciones']);
    }
  });
}

private crearNotificacionPagoComercio(transaccion: Transaccion) {
  const notificacion = {
    usuarioId: this.usuarioIdActual,
    titulo: 'Pago realizado',
    mensaje: `Has pagado ${transaccion.montoTotalFiat} USD al comercio ${this.comercioDestinoNombre}`,
    leido: false
  };
  
  this.notificacionService.crear(notificacion).subscribe();
}
```

---

## 8️⃣ HISTORIAL DESTINO

**Archivo**: `transaccion-listar.component.html`

```html
<!-- ❌ ANTES: Comercio destino -->
<!-- ✅ AHORA: Destino -->

<th>Destino</th>

<td>
  {{ obtenerNombreDestino(transaccion) }}
</td>
```

**Archivo**: `transaccion-listar.component.ts`

```typescript
obtenerNombreDestino(transaccion: Transaccion): string {
  // Si tiene comercio destinatario
  if (transaccion.comercioDestinoNombre) {
    return transaccion.comercioDestinoNombre;
  }
  
  // Si es P2P (tiene usuario destinatario)
  if (transaccion.usuarioDestinoNombre && transaccion.usuarioDestinoApellido) {
    return `${transaccion.usuarioDestinoNombre} ${transaccion.usuarioDestinoApellido}`;
  }
  
  return 'N/A';
}
```

---

## ✅ ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Backend primero** (Base de datos y servicios)
2. **Frontend después** (UI y validaciones)

### Orden específico:
1. ✅ Agregar `precioUSD` a Criptomoneda (BD + modelo)
2. ✅ Modificar creación de Wallet (backend)
3. ✅ Validar eliminación Wallet (backend + frontend)
4. ✅ Deshabilitar edición Wallet (frontend)
5. ✅ Calcular patrimonio USD (backend + frontend)
6. ✅ Filtrar actividad día (frontend)
7. ✅ Notificación pago (frontend)
8. ✅ Renombrar destino (frontend)

---

## 🧪 TESTING

Después de cada cambio, probar:
- ✅ Crear wallet (debe tener saldo 0 y dirección auto)
- ✅ Intentar eliminar wallet con saldo (debe fallar)
- ✅ Ver patrimonio en dashboard (debe mostrar USD)
- ✅ Ver actividad reciente (solo hoy)
- ✅ Pagar a comercio (debe notificar)
- ✅ Ver historial (debe mostrar destino correcto)
