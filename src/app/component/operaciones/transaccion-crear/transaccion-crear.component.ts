import { CommonModule } from '@angular/common';
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
import { TipoCambioService } from '../../../service/tipo-cambio.service';
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
    private tipoCambioService: TipoCambioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      comercioId: ['', Validators.required],
      criptoId: ['', Validators.required],
      metodoPagoId: ['', Validators.required],
      montoTotalFiat: [0, [Validators.required, Validators.min(1)]],


      codigoMoneda: [''],
      montoTotalCripto: [0],
      tasaAplicada: [1],
      tipoCambioId: [null, Validators.required],

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

  calcularConversion() {
    const criptoId = this.form.get('criptoId')?.value;
    const montoFiat = this.form.get('montoTotalFiat')?.value;

    if (criptoId) {
      const criptoSeleccionada = this.criptos.find(c => c.criptoId === criptoId);
      if (criptoSeleccionada) {
        this.form.patchValue({ codigoMoneda: criptoSeleccionada.codigo });
        this.tipoCambioService.obtenerTasaMasReciente(criptoSeleccionada.codigo, 'USD')
          .subscribe({
            next: (tipoCambio) => {
              if (tipoCambio) {
                this.form.patchValue({
                  tipoCambioId: tipoCambio.tipoCambioId,
                  tasaAplicada: tipoCambio.tasa
                });
                if (tipoCambio.tasa > 0) {
                  const totalCripto = montoFiat / tipoCambio.tasa;
                  this.form.patchValue({ montoTotalCripto: totalCripto });
                }
              }
            },
            error: () => {
              console.warn("No se encontró tasa de cambio para esta moneda");
            }
          });
      }
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.snackBar.open('Faltan datos o tasa de cambio no encontrada', 'Cerrar', { duration: 3000 });
      return;
    }

    this.guardando = true;
    this.transaccionService.crear(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Transacción realizada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/transacciones']);
        this.guardando = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al procesar', 'Cerrar', { duration: 3000 });
        this.guardando = false;
      }
    });
  }
}
