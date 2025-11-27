# Guía de Implementación - Funcionalidades Pendientes

## Funcionalidades Faltantes y Cómo Implementarlas

---

## 1. BOTÓN PAGAR CUOTAS

### Ubicación
`src/app/component/operaciones/cuota-dialog/cuota-dialog.component.html`

### Implementación

**En el HTML del diálogo, agregar botón de pagar:**

```html
<!-- Dentro de la tabla de cuotas, agregar columna de acciones -->
<ng-container matColumnDef="acciones">
  <th mat-header-cell *matHeaderCellDef>Acciones</th>
  <td mat-cell *matCellData="let cuota">
    <button 
      mat-raised-button 
      color="primary"
      *ngIf="cuota.estado !== 'PAGADA'"
      (click)="pagarCuota(cuota.id)"
      [disabled]="procesando">
      <mat-icon>payment</mat-icon>
      Pagar
    </button>
    <span *ngIf="cuota.estado === 'PAGADA'" class="badge-pagada">
      <mat-icon>check_circle</mat-icon> Pagada
    </span>
  </td>
</ng-container>
```

**En el TypeScript del componente:**

```typescript
// cuota-dialog.component.ts
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuotaService } from '../../../service/cuota.service';

export class CuotaDialogComponent {
  procesando = false;
  displayedColumns: string[] = ['numero', 'monto', 'fechaVencimiento', 'estado', 'acciones'];

  constructor(
    private cuotaService: CuotaService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CuotaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  pagarCuota(cuotaId: number): void {
    if (confirm('¿Está seguro de que desea pagar esta cuota?')) {
      this.procesando = true;
      
      this.cuotaService.pagarCuota(cuotaId).subscribe({
        next: (cuotaActualizada) => {
          this.snackBar.open('Cuota pagada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Actualizar la cuota en la lista
          const index = this.data.cuotas.findIndex((c: any) => c.id === cuotaId);
          if (index !== -1) {
            this.data.cuotas[index] = cuotaActualizada;
          }
          
          this.procesando = false;
        },
        error: (error) => {
          console.error('Error al pagar cuota:', error);
          this.snackBar.open('Error al pagar la cuota. Intente nuevamente.', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.procesando = false;
        }
      });
    }
  }
}
```

**CSS para el badge:**

```css
/* cuota-dialog.component.css */
.badge-pagada {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #4caf50;
  font-weight: 500;
}

.badge-pagada mat-icon {
  font-size: 20px;
  height: 20px;
  width: 20px;
}
```

---

## 2. VALIDACIONES ASÍNCRONAS

### 2.1 Validador de Email Único

**Crear archivo:** `src/app/validators/email-async.validator.ts`

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { UsuarioService } from '../service/usuario.service';

export function emailUnicoValidator(
  usuarioService: UsuarioService,
  idActual?: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
      switchMap(email => 
        usuarioService.obtenerPorEmail(email).pipe(
          map(usuario => {
            // Si existe un usuario con ese email y no es el actual
            if (usuario && usuario.id !== idActual) {
              return { emailEnUso: true };
            }
            return null;
          }),
          catchError(() => of(null)) // Si no existe, está disponible
        )
      ),
      first()
    );
  };
}
```

### 2.2 Validador de RUC Único

**Crear archivo:** `src/app/validators/ruc-async.validator.ts`

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ComercioService } from '../service/comercio.service';

export function rucUnicoValidator(
  comercioService: ComercioService,
  idActual?: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(500),
      switchMap(ruc => 
        comercioService.obtenerPorRuc(ruc).pipe(
          map(comercio => {
            if (comercio && comercio.id !== idActual) {
              return { rucEnUso: true };
            }
            return null;
          }),
          catchError(() => of(null))
        )
      ),
      first()
    );
  };
}
```

### 2.3 Uso en Formularios

**En usuario-crear.component.ts:**

```typescript
import { emailUnicoValidator } from '../../validators/email-async.validator';

export class UsuarioCrearComponent implements OnInit {
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const usuarioId = this.route.snapshot.params['id'];
    
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [
        '', 
        [Validators.required, Validators.email],
        [emailUnicoValidator(this.usuarioService, usuarioId)] // Validador asíncrono
      ],
      // ... otros campos
    });
  }
}
```

**En el HTML, mostrar el error:**

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email">
  
  <!-- Mostrar spinner mientras valida -->
  <mat-spinner 
    *ngIf="usuarioForm.get('email')?.pending" 
    diameter="20" 
    matSuffix>
  </mat-spinner>
  
  <mat-error *ngIf="usuarioForm.get('email')?.hasError('required')">
    El email es requerido
  </mat-error>
  <mat-error *ngIf="usuarioForm.get('email')?.hasError('email')">
    Email inválido
  </mat-error>
  <mat-error *ngIf="usuarioForm.get('email')?.hasError('emailEnUso')">
    Este email ya está registrado
  </mat-error>
</mat-form-field>
```

---

## 3. DETALLE DE WALLET (TRANSACCIONES POR WALLET)

### 3.1 Crear Componente

```bash
ng generate component component/finanzas/wallet-detalle
```

### 3.2 Agregar Servicio para Transacciones por Wallet

**En transaccion.service.ts, agregar:**

```typescript
obtenerPorWallet(walletId: number): Observable<Transaccion[]> {
  return this.http.get<Transaccion[]>(`${this.url}/wallet/${walletId}`);
}
```

### 3.3 Implementar Componente

**wallet-detalle.component.ts:**

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../../../service/wallet.service';
import { TransaccionService } from '../../../service/transaccion.service';
import { Wallet } from '../../../model/Wallet';
import { Transaccion } from '../../../model/Transaccion';

@Component({
  selector: 'app-wallet-detalle',
  templateUrl: './wallet-detalle.component.html',
  styleUrls: ['./wallet-detalle.component.css']
})
export class WalletDetalleComponent implements OnInit {
  wallet: Wallet | null = null;
  transacciones: Transaccion[] = [];
  cargando = true;
  displayedColumns: string[] = ['fecha', 'tipo', 'monto', 'estado', 'descripcion'];

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private transaccionService: TransaccionService
  ) {}

  ngOnInit(): void {
    const walletId = Number(this.route.snapshot.params['id']);
    this.cargarDatos(walletId);
  }

  cargarDatos(walletId: number): void {
    this.cargando = true;

    // Cargar wallet
    this.walletService.obtenerPorId(walletId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
      },
      error: (error) => {
        console.error('Error al cargar wallet:', error);
      }
    });

    // Cargar transacciones
    this.transaccionService.obtenerPorWallet(walletId).subscribe({
      next: (transacciones) => {
        this.transacciones = transacciones;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar transacciones:', error);
        this.cargando = false;
      }
    });
  }
}
```

**wallet-detalle.component.html:**

```html
<div class="container">
  <mat-card *ngIf="wallet">
    <mat-card-header>
      <mat-card-title>
        <mat-icon>account_balance_wallet</mat-icon>
        Detalle de Wallet
      </mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <div class="wallet-info">
        <div class="info-item">
          <strong>Criptomoneda:</strong> {{ wallet.criptomoneda?.nombre }}
        </div>
        <div class="info-item">
          <strong>Saldo:</strong> {{ wallet.saldo | number:'1.2-8' }}
        </div>
        <div class="info-item">
          <strong>Estado:</strong> 
          <span [class.activo]="wallet.activa" [class.inactivo]="!wallet.activa">
            {{ wallet.activa ? 'Activa' : 'Inactiva' }}
          </span>
        </div>
      </div>

      <h3>Historial de Transacciones</h3>

      <mat-spinner *ngIf="cargando"></mat-spinner>

      <table mat-table [dataSource]="transacciones" *ngIf="!cargando">
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let transaccion">
            {{ transaccion.fechaTransaccion | date:'short' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="tipo">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let transaccion">
            {{ transaccion.tipoTransaccion }}
          </td>
        </ng-container>

        <ng-container matColumnDef="monto">
          <th mat-header-cell *matHeaderCellDef>Monto</th>
          <td mat-cell *matCellDef="let transaccion">
            {{ transaccion.monto | currency }}
          </td>
        </ng-container>

        <ng-container matColumnDef="estado">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let transaccion">
            <span [class]="'badge-' + transaccion.estado.toLowerCase()">
              {{ transaccion.estado }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="descripcion">
          <th mat-header-cell *matHeaderCellDef>Descripción</th>
          <td mat-cell *matCellDef="let transaccion">
            {{ transaccion.descripcion }}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="!cargando && transacciones.length === 0" class="no-data">
        <mat-icon>info</mat-icon>
        <p>No hay transacciones para esta wallet</p>
      </div>
    </mat-card-content>

    <mat-card-actions>
      <button mat-button routerLink="/wallets">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
    </mat-card-actions>
  </mat-card>
</div>
```

### 3.4 Agregar Ruta

**En app.routes.ts:**

```typescript
import { WalletDetalleComponent } from './component/finanzas/wallet-detalle/wallet-detalle.component';

// Agregar en las rutas:
{ 
  path: 'wallets/detalle/:id', 
  component: WalletDetalleComponent, 
  canActivate: [seguridadGuard] 
},
```

### 3.5 Agregar Botón en Listado de Wallets

**En wallet-listar.component.html:**

```html
<!-- En la tabla, agregar columna de acciones -->
<ng-container matColumnDef="acciones">
  <th mat-header-cell *matHeaderCellDef>Acciones</th>
  <td mat-cell *matCellDef="let wallet">
    <button 
      mat-icon-button 
      [routerLink]="['/wallets/detalle', wallet.id]"
      matTooltip="Ver detalle">
      <mat-icon>visibility</mat-icon>
    </button>
    <button 
      mat-icon-button 
      [routerLink]="['/wallets/editar', wallet.id]"
      matTooltip="Editar">
      <mat-icon>edit</mat-icon>
    </button>
  </td>
</ng-container>
```

---

## 4. COMPONENTE DE REGISTRO (SIGN UP)

### 4.1 Crear Servicio de Registro

**En login-service.ts, agregar:**

```typescript
register(usuario: any): Observable<any> {
  return this.http.post(`${environment.apiUrl}/auth/register`, usuario);
}
```

### 4.2 Crear Componente

```bash
ng generate component autenticador/registro
```

### 4.3 Implementar Componente

**registro.component.ts:**

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../service/login-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      return;
    }

    this.cargando = true;
    const { confirmPassword, ...userData } = this.registroForm.value;

    this.loginService.register(userData).subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso. Por favor, inicie sesión.', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.snackBar.open('Error al registrar usuario. Intente nuevamente.', 'Cerrar', {
          duration: 4000
        });
        this.cargando = false;
      }
    });
  }
}
```

### 4.4 Agregar Ruta

**En app.routes.ts:**

```typescript
import { RegistroComponent } from './autenticador/registro/registro.component';

// Agregar:
{ path: 'registro', component: RegistroComponent },
```

### 4.5 Agregar Link en Login

**En autenticador.html:**

```html
<mat-card-actions>
  <button mat-raised-button color="primary" (click)="ingresar()">
    Iniciar Sesión
  </button>
  <button mat-button routerLink="/registro">
    ¿No tienes cuenta? Regístrate
  </button>
</mat-card-actions>
```

---

## 5. NOTIFICACIÓN DE TOKEN POR EXPIRAR

### 5.1 Crear Servicio de Monitoreo

**Crear archivo:** `src/app/service/token-monitor.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './login-service';

@Injectable({
  providedIn: 'root'
})
export class TokenMonitorService {
  private monitoreoActivo = false;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  iniciarMonitoreo(): void {
    if (this.monitoreoActivo) return;

    this.monitoreoActivo = true;

    // Verificar cada minuto
    interval(60000).subscribe(() => {
      const minutosRestantes = this.loginService.getMinutesUntilExpiration();

      if (minutosRestantes !== null) {
        // Advertir cuando quedan 5 minutos
        if (minutosRestantes === 5) {
          this.snackBar.open(
            'Tu sesión expirará en 5 minutos. Guarda tu trabajo.',
            'Entendido',
            { duration: 10000, panelClass: ['warning-snackbar'] }
          );
        }

        // Advertir cuando queda 1 minuto
        if (minutosRestantes === 1) {
          this.snackBar.open(
            '⚠️ Tu sesión expirará en 1 minuto.',
            'Cerrar',
            { duration: 60000, panelClass: ['error-snackbar'] }
          );
        }
      }
    });
  }

  detenerMonitoreo(): void {
    this.monitoreoActivo = false;
  }
}
```

### 5.2 Iniciar en App Component

**En app.component.ts:**

```typescript
import { TokenMonitorService } from './service/token-monitor.service';

export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private tokenMonitor: TokenMonitorService  // Agregar
  ) {}

  ngOnInit(): void {
    this.updateAuthState();
    
    // Iniciar monitoreo si está logueado
    if (this.isLoggedIn) {
      this.tokenMonitor.iniciarMonitoreo();
    }
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthState();
      
      // Controlar monitoreo según estado
      if (this.isLoggedIn) {
        this.tokenMonitor.iniciarMonitoreo();
      } else {
        this.tokenMonitor.detenerMonitoreo();
      }
    });
  }
}
```

---

## RESUMEN DE RUTAS DE ARCHIVOS

```
Nuevos archivos a crear:
├── src/app/validators/
│   ├── email-async.validator.ts
│   └── ruc-async.validator.ts
│
├── src/app/component/finanzas/wallet-detalle/
│   ├── wallet-detalle.component.ts
│   ├── wallet-detalle.component.html
│   └── wallet-detalle.component.css
│
├── src/app/autenticador/registro/
│   ├── registro.component.ts
│   ├── registro.component.html
│   └── registro.component.css
│
└── src/app/service/
    └── token-monitor.service.ts

Archivos a modificar:
├── src/app/component/operaciones/cuota-dialog/
│   ├── cuota-dialog.component.ts
│   └── cuota-dialog.component.html
│
├── src/app/service/
│   ├── transaccion.service.ts
│   └── login-service.ts
│
├── src/app/component/finanzas/wallet-listar/
│   └── wallet-listar.component.html
│
├── src/app/autenticador/
│   └── autenticador.html
│
├── src/app/app.routes.ts
└── src/app/app.component.ts
```

---

## PRIORIDAD DE IMPLEMENTACIÓN

1. **Alta Prioridad (Implementar primero):**
   - ✅ Botón Pagar Cuotas
   - ✅ Validaciones Asíncronas

2. **Media Prioridad:**
   - ✅ Detalle de Wallet
   - ✅ Notificación de Token por Expirar

3. **Baja Prioridad:**
   - ✅ Componente de Registro
   - Flujo de "Olvidé mi contraseña"

Cada funcionalidad está lista para implementar siguiendo esta guía. ¡Éxito!
