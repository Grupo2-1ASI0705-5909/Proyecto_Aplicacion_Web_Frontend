import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UsuarioService } from '../../service/usuario.service';
import { emailUnicoValidator } from '../../validators/email-async.validator';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  form: FormGroup;
  registrando = false;
  hidePassword = true;
  hideConfirmPassword = true;

  isComercio = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['',
        [Validators.required, Validators.email],
        [emailUnicoValidator(this.usuarioService)]
      ],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      esComercio: [false] // Control del toggle
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('passwordHash');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  registrar() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, completa todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.registrando = true;

    // Determinar rol: 3 = Comercio, 2 = Cliente (por defecto)
    const rolIdAsignado = this.form.get('esComercio')?.value ? 3 : 2;

    const usuario = {
      ...this.form.value,
      rolId: rolIdAsignado,
      estado: true
    };

    // Eliminar campo auxiliar del objeto final
    delete usuario.esComercio;
    delete usuario.confirmPassword;

    this.usuarioService.crear(usuario).subscribe({
      next: () => {
        this.snackBar.open('✅ Registro exitoso. Ya puedes iniciar sesión', 'Cerrar', {
          duration: 4000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        const mensaje = error.error?.message || 'Error al registrar usuario. Intenta nuevamente.';
        this.snackBar.open(`❌ ${mensaje}`, 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.registrando = false;
      }
    });
  }
}
