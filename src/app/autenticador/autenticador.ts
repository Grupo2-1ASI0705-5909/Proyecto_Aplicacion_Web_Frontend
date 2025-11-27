import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf
import { FormsModule } from '@angular/forms'; // Necesario para el binding [(ngModel)]
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; // Agregamos Card para el diseño
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { JwtRequest } from '../model/jwtRequest';
import { LoginService } from '../service/login-service';

@Component({
  selector: 'app-autenticador',
  standalone: true, // Asumimos que es standalone
  imports: [
    CommonModule,
    FormsModule, // <--- Necesario para el [(ngModel)]
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule 
  ],
  templateUrl: './autenticador.html', // Usaremos el mismo nombre
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {
  
  // 💡 NOTA: Usamos FormsModule, por eso declaramos variables simples
  email: string = ''; 
  passwordHash: string = ''; // Usamos un nombre amigable en el frontend
  
  mensaje: string = '';
  
  constructor(
    private loginService: LoginService, // Cambiado de 'loginService'
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Si ya tiene un token (ya se logueó), lo mandamos directo
    if (this.loginService.verificar()) {
        this.router.navigate(['/wallets']); // Ruta segura por defecto
    }
  }

  ingresar() {
    // 1. Validaciones básicas
    if (!this.email || !this.passwordHash) {
        this.mensaje = 'Debe ingresar email y contraseña.';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
        return;
    }
    
    // 2. Mapeo a la estructura que espera Java (AuthRequestDTO)
    const request: JwtRequest = {
        email: this.email,
        passwordHash: this.passwordHash // Mapeo clave: Contraseña del input se manda como passwordHash
    };

    // 3. Llamada al servicio
    this.loginService.login(request).subscribe({
      next: (data: any) => {
        // 4. Token guardado en AuthService (sessionStorage)
        
        // Redirecciona al home/wallets
        this.router.navigate(['/wallets']); 
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
        this.mensaje = 'Credenciales incorrectas.';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 3000 });
      }
    });
  }
}