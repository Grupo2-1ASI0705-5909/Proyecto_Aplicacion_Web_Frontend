import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
<<<<<<< HEAD
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComercioService } from '../../../service/comercio.service';
import { LoginService } from '../../../service/login-service';
import { rucUnicoValidator } from '../../../validators/ruc-async.validator';
=======
import { ComercioService } from '../../../service/comercio.service';
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8

@Component({
  selector: 'app-comercio-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
<<<<<<< HEAD
    MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule],
=======
    MatSlideToggleModule, MatSnackBarModule],
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
  templateUrl: './comercio-crear.component.html',
  styleUrl: './comercio-crear.component.css'
})
export class ComercioCrearComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idEditar: number | null = null;
<<<<<<< HEAD
  usuarioIdActual: number | null = null;
  guardando = false;
=======
  usuarioIdActual = 1; // Se asocia al usuario que lo crea (o admin)
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8

  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private router: Router,
    private route: ActivatedRoute,
<<<<<<< HEAD
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
=======
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombreComercial: ['', [Validators.required, Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      direccion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      estado: [true],
      usuarioId: [this.usuarioIdActual]
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
    });
  }

  ngOnInit(): void {
<<<<<<< HEAD
    // Obtener ID del usuario logueado
    this.usuarioIdActual = this.loginService.getUsuarioId();

=======
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
<<<<<<< HEAD

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
=======
        this.cargarDatos(this.idEditar);
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
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
<<<<<<< HEAD
    this.guardando = true;
=======
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8

    if (this.esEdicion && this.idEditar) {
      this.comercioService.actualizar(this.idEditar, comercio).subscribe({
        next: () => this.mostrarExito('Comercio actualizado'),
<<<<<<< HEAD
        error: (e) => {
          this.mostrarError(e);
          this.guardando = false;
        }
=======
        error: (e) => this.mostrarError(e)
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
      });
    } else {
      this.comercioService.crear(comercio).subscribe({
        next: () => this.mostrarExito('Comercio registrado'),
<<<<<<< HEAD
        error: (e) => {
          this.mostrarError(e);
          this.guardando = false;
        }
=======
        error: (e) => this.mostrarError(e)
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
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
