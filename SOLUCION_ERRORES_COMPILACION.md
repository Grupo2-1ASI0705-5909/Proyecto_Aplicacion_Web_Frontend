# 🔥 SOLUCIÓN RÁPIDA - COPIAR Y PEGAR ESTOS ARCHIVOS COMPLETOS

## ⚠️ IMPORTANTE: Los archivos se corrompieron durante la edición automática
## SOLUCIÓN: Copiar manualmente estos 2 archivos

---

## 📁 `wallet-crear.component.ts`

**Ubicación**: `src/app/component/finanzas/wallet-crear/wallet-crear.component.ts`

**BORRA TODO** y reemplaza con:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';  // ✅ AGREGADO
import { Criptomoneda } from '../../../model/Criptomoneda';
import { WalletService } from '../../../service/wallet.service';
import { CriptomonedaService } from '../../../service/criptomoneda.service';
import { UsuarioService } from '../../../service/usuario.service';
import { LoginService } from '../../../service/login-service';

@Component({
  selector: 'app-wallet-crear',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSlideToggleModule, MatSnackBarModule,
    MatIconModule  // ✅ AGREGADO
  ],
  templateUrl: './wallet-crear.component.html',
  styleUrl: './wallet-crear.component.css'
})
export class WalletCrearComponent implements OnInit {
  form: FormGroup;
  criptos: Criptomoneda[] = [];
  esEdicion = false;
  idEditar: number | null = null;
  usuarioIdActual: number | null = null;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private criptoService: CriptomonedaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
  ) {
    // ✅ FORMULARIO SIMPLIFICADO: Solo cripto y usuario
    this.form = this.fb.group({
      criptoId: ['', Validators.required],
      estado: [true],
      usuarioId: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCriptos();
    this.obtenerUsuarioLogueado();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
        this.cargarDatos(this.idEditar);
      }
    });
  }

  obtenerUsuarioLogueado() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        this.usuarioIdActual = usuario.usuarioId!;

        if (!this.esEdicion) {
          this.form.patchValue({ usuarioId: this.usuarioIdActual });
        }
      });
    }
  }

  cargarCriptos() {
    this.criptoService.obtenerActivas().subscribe(data => {
      this.criptos = data;
    });
  }

  cargarDatos(id: number) {
    this.walletService.obtenerPorId(id).subscribe(data => {
      this.form.patchValue({
        criptoId: data.criptoId || data.criptomoneda?.criptoId,
        direccion: data.direccion,
        saldo: data.saldo,
        estado: data.estado,
        usuarioId: data.usuarioId
      });
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const wallet = this.form.value;

    if (this.esEdicion && this.idEditar) {
      this.walletService.actualizar(this.idEditar, wallet).subscribe(() => {
        this.mostrarExito('Wallet actualizada');
      });
    } else {
      this.walletService.crear(wallet).subscribe(() => {
        this.mostrarExito('Wallet registrada con éxito');
      });
    }
  }

  mostrarExito(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/wallets']);
  }
}
```

---

## 📁 `wallet-listar.component.html`

**Ubicación**: `src/app/component/finanzas/wallet-listar/wallet-listar.component.html`

En la tabla, **BUSCA** la línea con el botón eliminar que dice:

```html
(click)="eliminar(w.walletId!)"
```

Y **REEMPLÁZALA** con:

```html
(click)="eliminar(w)"
```

El botón completo debe quedar así:

```html
<button 
  mat-icon-button 
  color="warn" 
  (click)="eliminar(w)"
  [disabled]="w.saldo > 0"
  [matTooltip]="w.saldo > 0 ? 'No puedes eliminar wallet con saldo' : 'Eliminar wallet'">
  <mat-icon>delete</mat-icon>
</button>
```

---

## 📁 `wallet-listar.component.ts`

**Ubicación**: `src/app/component/finanzas/wallet-listar/wallet-listar.component.ts`

**BUSCA** el archivo en: `ARCHIVOS_COMPLETOS_COPIAR.md` (archivo que creé antes)

Y copia el contenido completo de ahí.

---

## ✅ DESPUÉS DE COPIAR/PEGAR:

1. Guarda todos los archivos
2. Cierra el servidor Angular (Ctrl+C)
3. Ejecuta:
   ```
   ng serve -o
   ```

---

## 🆘 SI SIGUE FALLANDO:

Ejecuta esto para limpiar todo:

```powershell
# Detener servidor (Ctrl+C)

# Limpiar caché
Remove-Item -Recurse -Force .angular/cache
Remove-Item -Recurse -Force node_modules/.cache

# Reiniciar
ng serve -o
```
