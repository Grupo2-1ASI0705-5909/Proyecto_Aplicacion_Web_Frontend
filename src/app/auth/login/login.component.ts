import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, // <--- Indispensable para [formGroup]
    MatCardModule,       // <--- Para las tarjetas
    MatFormFieldModule,  // <--- Para los inputs bonitos
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // <--- Inyectar
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Asegúrate que los nombres coincidan con lo que espera tu backend (username/password)
    this.form = this.fb.group({
      email: ['', Validators.required], // Antes era email, el backend suele pedir username
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    // 1. Obtenemos los datos del formulario
    // (Asegúrate que en tu ngOnInit el campo se llame 'email' y no 'username')
    const emailIngresado = this.form.value.email; 
    const passwordIngresado = this.form.value.password;

    // 2. Armamos el objeto EXACTO para Java
    const credenciales = {
      email: emailIngresado,          // Java espera "email"
      passwordHash: passwordIngresado // Java espera "passwordHash"
    };

    // 3. Enviamos el objeto
    this.authService.login(credenciales).subscribe({
      next: (res) => {
        this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/wallets']); // O a donde quieras ir al entrar
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
      }
    });
  } 
}
