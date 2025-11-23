import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Transaccion } from '../../../model/Transaccion';
import { PlanPagoService } from '../../../service/plan-pago.service';
import { TransaccionService } from '../../../service/transaccion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-plan-pago-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './plan-pago-crear.component.html',
  styleUrl: './plan-pago-crear.component.css'
})
export class PlanPagoCrearComponent implements OnInit{
form: FormGroup;
  transacciones: Transaccion[] = []; // Para llenar el select
  minDate: Date = new Date(); // Fecha mínima hoy

  constructor(
    private fb: FormBuilder,
    private planService: PlanPagoService,
    private transaccionService: TransaccionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      transaccionId: ['', Validators.required],
      numeroCuotas: [1, [Validators.required, Validators.min(1), Validators.max(36)]],
      interes: [0, [Validators.required, Validators.min(0)]],
      fechaInicio: [new Date(), Validators.required],
      // El monto por cuota lo calcularemos o lo ingresaremos manual
      montoPorCuota: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Cargamos todas las transacciones para que el usuario elija
    // (En un caso real, filtrarías solo las que NO tienen plan todavía)
    this.transaccionService.obtenerTodos().subscribe(data => {
      this.transacciones = data;
    });
  }

  // Función auxiliar para calcular la cuota automática (Opcional)
  calcularCuota() {
    const tId = this.form.get('transaccionId')?.value;
    const cuotas = this.form.get('numeroCuotas')?.value;
    const interes = this.form.get('interes')?.value;

    const transaccion = this.transacciones.find(t => t.transaccionId === tId);

    if (transaccion && cuotas > 0) {
      const montoTotal = transaccion.montoTotalFiat * (1 + (interes / 100));
      const montoCuota = montoTotal / cuotas;
      
      // Actualizamos el campo del formulario automáticamente
      this.form.patchValue({ montoPorCuota: montoCuota.toFixed(2) });
    }
  }

  guardar() {
    if (this.form.invalid) return;

    // Aseguramos que la fecha vaya en formato string si tu backend lo pide así, 
    // o dejamos que Angular lo mande (depende de tu PlanPagoDTO)
    const datos = this.form.value;

    this.planService.crear(datos).subscribe({
      next: () => {
        this.snackBar.open('Plan de pago creado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/planes']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al crear el plan', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
