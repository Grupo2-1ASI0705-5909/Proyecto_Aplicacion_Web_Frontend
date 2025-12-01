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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
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
    this.form = this.fb.group({
      criptoId: ['', Validators.required],
      estado: [true],
      usuarioId: ['', Validators.required]
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
    // 1. Intentar obtener ID directamente del token (más rápido)
    const idToken = this.loginService.getUsuarioId();
    if (idToken) {
      console.log('WalletCrear: Usuario ID obtenido del token:', idToken);
      this.usuarioIdActual = idToken;
      if (!this.esEdicion) {
        this.form.patchValue({ usuarioId: this.usuarioIdActual });
      }
      return;
    }

    // 2. Si no está en el token, buscar por email (Patrón robusto usado en otros componentes)
    const email = this.loginService.getUsuarioActual();
    console.log('WalletCrear: Buscando usuario por email:', email);

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe({
        next: (usuario) => {
          console.log('WalletCrear: Usuario encontrado por email:', usuario);
          if (usuario && usuario.usuarioId) {
            this.usuarioIdActual = usuario.usuarioId;
            if (!this.esEdicion) {
              this.form.patchValue({ usuarioId: this.usuarioIdActual });
            }
          }
        },
        error: (err) => {
          console.error('WalletCrear: Error al obtener usuario por email', err);
          this.snackBar.open('Error al identificar usuario. Intente iniciar sesión nuevamente.', 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      console.warn('WalletCrear: No se pudo obtener email del token');
      this.snackBar.open('No se pudo identificar al usuario. Inicie sesión.', 'Cerrar', { duration: 5000 });
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
    if (this.form.invalid) {
      console.warn('WalletCrear: Formulario inválido', this.form.errors);
      return;
    }

    const wallet = this.form.value;
    console.log('WalletCrear: Enviando wallet:', wallet);

    // Asegurar que usuarioId sea número
    wallet.usuarioId = Number(wallet.usuarioId);

    if (this.esEdicion && this.idEditar) {
      this.walletService.actualizar(this.idEditar, wallet).subscribe({
        next: () => this.mostrarExito('Wallet actualizada'),
        error: (err) => {
          console.error('WalletCrear: Error al actualizar', err);
          this.snackBar.open('Error al actualizar wallet: ' + err.message, 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.walletService.crear(wallet).subscribe({
        next: () => this.mostrarExito('Wallet registrada con éxito'),
        error: (err) => {
          console.error('WalletCrear: Error al crear', err);
          // Mostrar mensaje detallado si es 401
          if (err.status === 401) {
            this.snackBar.open('Error de autorización (401). Revise su sesión.', 'Cerrar', { duration: 5000 });
          } else {
            this.snackBar.open('Error al crear wallet: ' + (err.error?.message || err.message), 'Cerrar', { duration: 3000 });
          }
        }
      });
    }
  }

  mostrarExito(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/wallets']);
  }
}
