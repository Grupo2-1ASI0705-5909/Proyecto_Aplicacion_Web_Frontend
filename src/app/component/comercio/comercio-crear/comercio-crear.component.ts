import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComercioService } from '../../../service/comercio.service';
import { LoginService } from '../../../service/login-service';
import { rucUnicoValidator } from '../../../validators/ruc-async.validator';

@Component({
  selector: 'app-comercio-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './comercio-crear.component.html',
  styleUrl: './comercio-crear.component.css'
})
export class ComercioCrearComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idEditar: number | null = null;
  usuarioIdActual: number | null = null;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      nombreComercial: ['', [Validators.required, Validators.maxLength(100)]],
      ruc: ['',
        [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')],
        [] // Async validators se agregan en ngOnInit
      ],
      direccion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      estado: [true],
      usuarioId: [null]
    });
  }

  ngOnInit(): void {
    // Obtener ID del usuario logueado
    this.usuarioIdActual = this.loginService.getUsuarioId();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);

        // Agregar validador asíncrono para edición
        this.form.get('ruc')?.setAsyncValidators([
          rucUnicoValidator(this.comercioService, this.idEditar)
        ]);

        this.cargarDatos(this.idEditar);
      } else {
        // Agregar validador asíncrono para creación
        this.form.get('ruc')?.setAsyncValidators([
          rucUnicoValidator(this.comercioService)
        ]);
      }

      // Asignar usuario ID al formulario
      if (this.usuarioIdActual) {
        this.form.patchValue({ usuarioId: this.usuarioIdActual });
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
    this.guardando = true;

    if (this.esEdicion && this.idEditar) {
      this.comercioService.actualizar(this.idEditar, comercio).subscribe({
        next: () => this.mostrarExito('Comercio actualizado'),
        error: (e) => {
          this.mostrarError(e);
          this.guardando = false;
        }
      });
    } else {
      this.comercioService.crear(comercio).subscribe({
        next: () => this.mostrarExito('Comercio registrado'),
        error: (e) => {
          this.mostrarError(e);
          this.guardando = false;
        }
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
