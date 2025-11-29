import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ComercioService } from '../../../service/comercio.service';

@Component({
  selector: 'app-comercio-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatSnackBarModule],
  templateUrl: './comercio-crear.component.html',
  styleUrl: './comercio-crear.component.css'
})
export class ComercioCrearComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idEditar: number | null = null;
  usuarioIdActual = 1; // Se asocia al usuario que lo crea (o admin)

  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombreComercial: ['', [Validators.required, Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      direccion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      estado: [true],
      usuarioId: [this.usuarioIdActual]
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
    this.comercioService.obtenerPorId(id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const comercio = this.form.value;

    if (this.esEdicion && this.idEditar) {
      this.comercioService.actualizar(this.idEditar, comercio).subscribe({
        next: () => this.mostrarExito('Comercio actualizado'),
        error: (e) => this.mostrarError(e)
      });
    } else {
      this.comercioService.crear(comercio).subscribe({
        next: () => this.mostrarExito('Comercio registrado'),
        error: (e) => this.mostrarError(e)
      });
    }
  }

  mostrarExito(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/comercios']);
  }

  mostrarError(err: any) {
    console.error(err);
    this.snackBar.open('Error al guardar el comercio', 'Cerrar', { duration: 3000 });
  }
}
