import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { JwtRequest } from '../model/jwtRequest';
import { LoginService } from '../service/login-service';

@Component({
  selector: 'app-autenticador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {

  email: string = '';
  passwordHash: string = '';
  mensaje: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.loginService.verificar()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ingresar() {
    if (!this.email || !this.passwordHash) {
      this.mensaje = 'Debe ingresar email y contraseña.';
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      return;
    }

    const request: JwtRequest = {
      email: this.email,
      passwordHash: this.passwordHash
    };

    this.loginService.login(request).subscribe({
      next: (data: any) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
        this.mensaje = 'Credenciales incorrectas.';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 3000 });
      }
    });
  }
}