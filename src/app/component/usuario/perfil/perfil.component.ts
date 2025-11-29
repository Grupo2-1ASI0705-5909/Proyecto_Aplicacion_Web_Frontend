import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../service/usuario.service';
import { Usuario } from '../../../model/Usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  usuario: Usuario | null = null;
  usuarioIdActual = 1; // En un sistema real vendría del AuthService

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [{value: '', disabled: true}, Validators.required], // Email suele ser ID, readonly
      telefono: ['', Validators.required],
      // Campos ocultos necesarios para el update
      rolId: [''],
      estado: [''],
      passwordHash: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.usuarioService.obtenerPorId(this.usuarioIdActual).subscribe(data => {
      this.usuario = data;
      this.form.patchValue({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        rolId: data.rolId,
        estado: data.estado,
        passwordHash: data.passwordHash
      });
    });
  }

  actualizar() {
    if (this.form.invalid || !this.usuario) return;

    // Fusionamos los datos del formulario con el objeto original
    const datosActualizados: Usuario = {
      ...this.usuario,
      ...this.form.getRawValue() // getRawValue incluye campos disabled
    };

    this.usuarioService.actualizar(this.usuarioIdActual, datosActualizados).subscribe({
      next: (res) => {
        this.usuario = res;
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
