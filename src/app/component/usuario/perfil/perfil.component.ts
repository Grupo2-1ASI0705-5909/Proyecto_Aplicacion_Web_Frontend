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
import { LoginService } from '../../../service/login-service';

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
  usuarioIdActual: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      telefono: ['', Validators.required],
      // Campos ocultos necesarios para el update
      rolId: [''],
      estado: [''],
      passwordHash: ['']
    });
  }

  ngOnInit(): void {
    // Obtener ID del usuario logueado
    const email = this.loginService.getUsuarioActual();

    if (email) {
      // 2. Pedir al backend los datos del usuario usando ese email
      this.usuarioService.obtenerPorEmail(email).subscribe({
        next: (data: any) => {

          // --- CORRECCIÓN AQUÍ ---
          this.usuario = data; // <--- ¡FALTABA ESTA LÍNEA!
          // Sin esto, la variable 'usuario' se queda vacía y falla al guardar.

          this.usuarioIdActual = data.usuarioId;

          console.log('Usuario recuperado:', this.usuario); // Ahora sí verás el objeto
          console.log('Usuario ID recuperado:', this.usuarioIdActual);

          // 4. Llenar el formulario
          this.form.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            rolId: data.rolId,
            estado: data.estado,
            passwordHash: data.passwordHash
          });
        },
        error: (e) => console.error('Error al cargar perfil', e)
      });
    }
  }

  cargarPerfil() {
    if (!this.usuarioIdActual) return;

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
    console.log('actualizar() llamado');
    console.log('Form valid:', this.form.valid);
    console.log('Form invalid:', this.form.invalid);
    console.log('Usuario:', this.usuario);
    console.log('Usuario ID Actual:', this.usuarioIdActual);
    console.log('Form values:', this.form.getRawValue());

    if (this.form.invalid) {
      console.log('Formulario inválido');
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.usuario) {
      console.log('No hay datos de usuario');
      this.snackBar.open('No se pudieron cargar los datos del usuario', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.usuarioIdActual) {
      console.log('No hay ID de usuario');
      this.snackBar.open('Usuario no identificado', 'Cerrar', { duration: 3000 });
      return;
    }

    // Fusionamos los datos del formulario con el objeto original
    const datosActualizados: Usuario = {
      ...this.usuario,
      ...this.form.getRawValue() // getRawValue incluye campos disabled
    };

    console.log('Datos a actualizar:', datosActualizados);

    this.usuarioService.actualizar(this.usuarioIdActual, datosActualizados).subscribe({
      next: (res) => {
        console.log('Actualización exitosa:', res);
        this.usuario = res;
        this.form.markAsPristine(); // Marcar formulario como sin cambios
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.snackBar.open('Error al actualizar perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }
}