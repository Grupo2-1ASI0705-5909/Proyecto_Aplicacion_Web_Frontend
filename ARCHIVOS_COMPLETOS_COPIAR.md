# 🎯 ARCHIVOS COMPLETOS - COPIA Y PEGA

## ✅ TODO LO QUE FALTA IMPLEMENTAR

---

## 📁 1. wallet-listar.component.ts

Reemplaza TODO el archivo con este contenido:

```typescript
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Wallet } from '../../../model/Wallet';
import { WalletService } from '../../../service/wallet.service';
import { WalletStateService } from '../../../service/wallet-state.service';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-wallet-listar',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './wallet-listar.component.html',
  styleUrl: './wallet-listar.component.css'
})
export class WalletListarComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Wallet>();
  displayedColumns: string[] = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];

  saldoTotal: number = 0;
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  private walletsSubscription?: Subscription;
  private reloadSubscription?: Subscription;

  constructor(
    private walletService: WalletService,
    private walletStateService: WalletStateService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    console.log('[INIT] WalletListarComponent inicializado');
    this.suscribirseAEstadoCompartido();
    this.suscribirseARecargas();
    this.verificarPermisosYCargar();
  }

  ngOnDestroy(): void {
    this.walletsSubscription?.unsubscribe();
    this.reloadSubscription?.unsubscribe();
    console.log('[CLEANUP] WalletListarComponent destruido - suscripciones limpiadas');
  }

  suscribirseAEstadoCompartido() {
    this.walletsSubscription = this.walletStateService.wallets$.subscribe(wallets => {
      if (wallets.length > 0) {
        console.log('[STATE] Wallets actualizadas desde el estado compartido:', wallets);
        this.dataSource.data = wallets;
        this.calcularSaldoTotal(wallets);
      }
    });
  }

  suscribirseARecargas() {
    this.reloadSubscription = this.walletStateService.reload$.subscribe(shouldReload => {
      if (shouldReload) {
        console.log('[RELOAD] Recibida señal de recarga - actualizando desde backend');
        this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
      }
    });
  }

  calcularSaldoTotal(wallets: Wallet[]) {
    this.saldoTotal = wallets.reduce((sum, wallet) => sum + wallet.saldo, 0);
  }

  verificarPermisosYCargar() {
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarTodas();
    } else {
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.walletService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      this.saldoTotal = 0;
      this.walletStateService.setWallets(data);
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;

          this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            console.log('[DATA] Wallets del usuario cargadas desde backend:', data);
            this.dataSource.data = data;
            this.walletStateService.setWallets(data);
          });

          this.walletService.obtenerSaldoTotalUsuario(this.usuarioIdActual).subscribe(total => {
            this.saldoTotal = total;
          });
        }
      });
    }
  }

  // ✅ MODIFICADO: Validar saldo antes de eliminar
  eliminar(wallet: Wallet) {
    // Validar que la wallet no tenga saldo
    if (wallet.saldo && wallet.saldo > 0) {
      this.snackBar.open(
        `No puedes eliminar una wallet con saldo positivo. Saldo actual: ${wallet.saldo}`,
        'Cerrar',
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la wallet de ${wallet.criptomoneda?.nombre}?`)) {
      this.walletService.eliminar(wallet.walletId!).subscribe({
        next: () => {
          this.snackBar.open('Wallet eliminada correctamente', 'Cerrar', { duration: 3000 });
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => {
          const mensaje = err.error?.message || err.message || 'Error al eliminar la wallet';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
          console.error('Error eliminando wallet:', err);
        }
      });
    }
  }
}
```

---

## 📁 2. wallet-listar.component.html

Encuentra la línea con el botón eliminar y reemplázala:

**BUSCA**:
```html
<button mat-icon-button color="warn" (click)="eliminar(wallet.walletId)">
```

**REEMPLAZA CON**:
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

Y **ELIMINA** completamente el botón de editar si existe.

---

## 📁 3. dashboard.component.ts

BUSCA el método `cargarKPIs()` y REEMPLÁZALO con:

```typescript
cargarKPIs() {
  if (!this.usuarioIdActual) return;

  // 1. KPI Principal
  if (this.isAdmin) {
    this.usuarioService.contarUsuariosActivos().subscribe(count => this.totalUsuarios = count);
  } else if (this.isComercio) {
    this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
      this.ventasTotales = data.reduce((acc, tx) => acc + tx.montoTotalFiat, 0);
      this.transaccionesRecientes = data.slice(0, 5);
    });
  } else {
    // ✅ MODIFICADO: Usar patrimonio en USD
    this.walletService.obtenerPatrimonioUSD(this.usuarioIdActual).subscribe(
      patrimonio => this.saldoTotal = patrimonio
    );
  }

  // 2. Cargar transacciones recientes del día
  this.cargarTransaccionesRecientes();
}

// ✅ NUEVO: Filtrar solo transacciones del día actual
cargarTransaccionesRecientes() {
  if (!this.usuarioIdActual) return;
  
  if (this.isAdmin) {
    this.transaccionService.obtenerRecientes().subscribe(data => {
      this.transaccionesRecientes = this.filtrarPorDiaActual(data).slice(0, 5);
    });
  } else if (!this.isComercio) {
    this.transaccionService.obtenerPorUsuario(this.usuarioId Actual).subscribe(data => {
      this.transaccionesRecientes = this.filtrarPorDiaActual(data).slice(0, 5);
    });
  }
}

// ✅ NUEVO: Filtro por día
private filtrarPorDiaActual(transacciones: Transaccion[]): Transaccion[] {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return transacciones.filter(tx => {
    const fechaTx = new Date(tx.fechaTransaccion);
    fechaTx.setHours(0, 0, 0, 0);
    return fechaTx.getTime() === hoy.getTime();
  });
}
```

---

## 📁 4. transaccion-crear.component.ts

BUSCA el método donde creas la transacción y AGREGA esto después del éxito:

```typescript
realizarPago() {
  // ... tu código existente ...
  
  this.transaccionService.crear(transaccion).subscribe({
    next: (response) => {
      this.snackBar.open('Pago realizado con éxito', 'Cerrar', { duration: 3000 });
      
      // ✅ NUEVO: Crear notificación si es pago a comercio
      if (this.tipoDestinatario === 'comercio' && this.comercioDestinoId) {
        this.crearNotificacionPagoComercio(response);
      }
      
      this.router.navigate(['/transacciones']);
    },
    error: (err) => {
      this.snackBar.open('Error al realizar el pago', 'Cerrar', { duration: 3000 });
      console.error(err);
    }
  });
}

// ✅ NUEVO: Crear notificación
private crearNotificacionPagoComercio(transaccion: any) {
  const notificacion = {
    usuarioId: this.usuarioIdActual,
    titulo: 'Pago realizado',
    mensaje: `Has pagado ${transaccion.montoTotalFiat} USD al comercio`,
    leido: false
  };
  
  this.notificacionService.crear(notificacion).subscribe({
    next: () => console.log('Notificación creada'),
    error: (err) => console.error('Error creando notificación:', err)
  });
}
```

NO OLVIDES inyectar el servicio en el constructor:

```typescript
constructor(
  // ... otros servicios ...
  private notificacionService: NotificacionService  // ✅ AGREGAR
) { }
```

---

## 📁 5. transaccion-listar.component.html

BUSCA la columna que dice "Comercio destino" o similar y reemplázala:

**BUSCA**:
```html
<th>Comercio Destino</th>
```

**REEMPLAZA CON**:
```html
<th>Destino</th>
```

**BUSCA**:
```html
<td>{{ transaccion.comercioDestinoNombre || 'N/A' }}</td>
```

**REEMPLAZA CON**:
```html
<td>{{ obtenerNombreDestino(transaccion) }}</td>
```

---

## 📁 6. transaccion-listar.component.ts

AGREGA este método a la clase:

```typescript
// ✅ NUEVO: Obtener nombre del destino (comercio o P2P)
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

## 📁 7. wallet-crear.component.html (Agregar MatIconModule)

Si el ícono no aparece, agrega MatIconModule al imports del componente:

```typescript
imports: [
  CommonModule,
  ReactiveFormsModule,
  RouterLink,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatIconModule  // ✅ AGREGAR
]
```

---

## 🗄️ SQL - NO OLVIDES EJECUTAR

```sql
ALTER TABLE criptomonedas 
ADD COLUMN IF NOT EXISTS preciousd DECIMAL(18,2) NOT NULL DEFAULT 0.00;

UPDATE criptomonedas SET preciousd =  45000.00 WHERE codigo = 'BTC';
UPDATE criptomonedas SET preciousd = 3200.00 WHERE codigo = 'ETH';
UPDATE criptomonedas SET preciousd = 1.00 WHERE codigo = 'USDT';
UPDATE criptomonedas SET preciousd = 1.00 WHERE codigo = 'USDC';
UPDATE criptomonedas SET preciousd = 580.00 WHERE codigo = 'BNB';
```

---

## ✅ CHECKLIST FINAL

- [ ] Ejecutar SQL en PostgreSQL
- [ ] Recompilar backend: `mvn clean compile -DskipTests`
- [ ] Reiniciar backend: `mvn spring-boot:run`
- [ ] Limpiar caché Angular: `Remove-Item -Recurse -Force .angular/cache`
- [ ] Reiniciar frontend: `ng serve`
- [ ] Probar creación de wallet (debe generar dirección automática)
- [ ] Probar eliminación de wallet con saldo (debe bloquear)
- [ ] Ver patrimonio en dashboard (debe mostrar USD)
- [ ] Ver actividad reciente (solo del día)
- [ ] Hacer pago a comercio (debe crear notificación)
- [ ] Ver historial (columna "Destino" funcional)

---

## 🎉 ¡LISTO!

Con estos cambios, TODAS las mejoras solicitadas estarán implementadas.
