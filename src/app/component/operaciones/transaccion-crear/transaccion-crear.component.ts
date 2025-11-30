import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { TransaccionService } from '../../../service/transaccion.service';
import { ComercioService } from '../../../service/comercio.service';
import { CriptomonedaService } from '../../../service/criptomoneda.service';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../service/login-service';

@Component({
  selector: 'app-transaccion-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './transaccion-crear.component.html',
  styleUrl: './transaccion-crear.component.css'
})
export class TransaccionCrearComponent implements OnInit {
  form: FormGroup;
  comercios: any[] = [];
  criptos: any[] = [];
  metodos: any[] = [];

  usuarioIdActual: number | null = null;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private transaccionService: TransaccionService,
    private comercioService: ComercioService,
    private criptoService: CriptomonedaService,
    private metodoPagoService: MetodoPagoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      comercioId: ['', Validators.required],
      criptoId: ['', Validators.required],
      metodoPagoId: ['', Validators.required],
      montoTotalFiat: [0, [Validators.required, Validators.min(1)]],
      // Estos campos se ignoran o usan valores por defecto, el backend los calculará
      codigoMoneda: ['USD'],
      montoTotalCripto: [0],
      tasaAplicada: [1],
      tipoCambioId: [null], // No requerido, el backend lo obtiene
      usuarioId: [this.usuarioIdActual],
      estado: ['PENDIENTE'],
      txHash: ['GENERATED_BY_FRONT']
    });
  }

  ngOnInit(): void {
    // Obtener ID del usuario logueado
    this.usuarioIdActual = this.loginService.getUsuarioId();

    if (this.usuarioIdActual) {
      this.form.patchValue({ usuarioId: this.usuarioIdActual });
    }

    this.comercioService.obtenerTodos().subscribe(data => this.comercios = data);
    this.criptoService.obtenerActivas().subscribe(data => this.criptos = data);
    this.metodoPagoService.obtenerActivos().subscribe(data => this.metodos = data);
  }

  // ELIMINADO: calcularConversion() 
  // El backend ahora se encarga de:
  // 1. Obtener el TipoCambioId
  // 2. Calcular montoTotalCripto y tasaAplicada de forma segura

  guardar() {
    if (this.form.invalid) {
      this.snackBar.open('Faltan datos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.guardando = true;
    this.transaccionService.crear(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Transacción realizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/transacciones']);
        this.guardando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        let mensaje = 'Error desconocido al procesar la transacción';

        if (err.status === 0) {
          mensaje = 'No se pudo conectar al servidor. Verifique su conexión.';
        } else if (err.status === 400) {
          mensaje = err.error?.message || 'Datos de transacción inválidos.';
        } else if (err.status === 401) {
          // Verificar si el token existe y está expirado
          const token = sessionStorage.getItem('token');
          const errorMessage = err.error?.message || err.message || '';

          const isTokenExpired = !token ||
            errorMessage.toLowerCase().includes('expired') ||
            errorMessage.toLowerCase().includes('expirado');

          if (isTokenExpired) {
            mensaje = '⏱️ Su sesión ha expirado. Por favor inicie sesión nuevamente.';
            this.snackBar.open(`❌ ${mensaje}`, 'Cerrar', { duration: 5000 });
            sessionStorage.removeItem('token');
            this.router.navigate(['/login']);
            return;
          } else {
            // Token válido pero sin permisos para esta operación específica
            mensaje = 'No tiene autorización para crear transacciones. Verifique que su cuenta tenga el rol correcto (USUARIO o ADMINISTRADOR).';
          }
        } else if (err.status === 403) {
          mensaje = 'No tiene permisos para realizar esta operación.';
        } else if (err.status === 404) {
          mensaje = 'Recurso no encontrado (Comercio, Cripto o Tasa de cambio no válidos).';
        } else if (err.status >= 500) {
          mensaje = 'Error interno del servidor. Intente más tarde.';
        }

        this.snackBar.open(`❌ ${mensaje}`, 'Cerrar', {
          duration: 5000
        });

        console.error('Error completo:', err);
      }
    });
  }
}
