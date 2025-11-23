import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MetodoPagoService } from '../../../service/metodo-pago.service';

@Component({
  selector: 'app-metodo-pago-crear',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule, 
    MatSlideToggleModule, MatSnackBarModule
  ],
  templateUrl: './metodo-pago-crear.component.html',
  styleUrl: './metodo-pago-crear.component.css'
})
export class MetodoPagoCrearComponent implements OnInit{
  form: FormGroup;
  esEdicion = false;
  idEditar: number | null = null;

  constructor(
    private fb: FormBuilder,
    private metodoService: MetodoPagoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      estado: [true] // Valor por defecto: Activo
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
        this.cargarDatos(this.idEditar);
      }
    });
  }

  cargarDatos(id: number) {
    this.metodoService.obtenerPorId(id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const metodo = this.form.value;

    if (this.esEdicion && this.idEditar) {
      this.metodoService.actualizar(this.idEditar, metodo).subscribe(() => {
        this.mostrarExito('Método de pago actualizado');
      });
    } else {
      this.metodoService.crear(metodo).subscribe(() => {
        this.mostrarExito('Método de pago creado');
      });
    }
  }

  mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/metodos-pago']);
  }
}
