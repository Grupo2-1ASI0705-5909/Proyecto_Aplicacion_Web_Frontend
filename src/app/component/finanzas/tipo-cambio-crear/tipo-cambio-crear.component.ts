import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TipoCambioService } from '../../../service/tipo-cambio.service';

@Component({
  selector: 'app-tipo-cambio-crear',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './tipo-cambio-crear.component.html',
  styleUrl: './tipo-cambio-crear.component.css'
})
export class TipoCambioCrearComponent {
form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tipoCambioService: TipoCambioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      desdeCodigo: ['', [Validators.required, Validators.maxLength(10)]],
      hastaCodigo: ['', [Validators.required, Validators.maxLength(10)]],
      tasa: ['', [Validators.required, Validators.min(0.000000000001)]],
      fuente: ['', [Validators.required, Validators.maxLength(100)]],
      // La fecha la pone el backend (LocalDateTime.now())
    });
  }

  guardar() {
    if (this.form.invalid) return;

    // Convertimos a mayúsculas los códigos (ej: btc -> BTC)
    const datos = this.form.value;
    datos.desdeCodigo = datos.desdeCodigo.toUpperCase();
    datos.hastaCodigo = datos.hastaCodigo.toUpperCase();

    this.tipoCambioService.crear(datos).subscribe({
      next: () => {
        this.snackBar.open('Tasa registrada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/tipos-cambio']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
