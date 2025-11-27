import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MetodoPago } from '../../../model/MetodoPago';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-metodo-pago-listar',
  standalone: true,
  imports: [CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatSnackBarModule],
  templateUrl: './metodo-pago-listar.component.html',
  styleUrl: './metodo-pago-listar.component.css'
})
export class MetodoPagoListarComponent implements OnInit{
dataSource = new MatTableDataSource<MetodoPago>();
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'acciones'];
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private metodoService: MetodoPagoService,
    private snackBar: MatSnackBar,
    private loginService: LoginService, // Para saber quién es
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.verificarPermisosYCargar();
  }

  verificarPermisosYCargar() {
    // 1. Verificamos el Rol
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      // CASO A: Es ADMIN -> Ve TODAS las wallets del sistema
      // Agregamos columna propietario para que el admin sepa de quién es
      this.displayedColumns = ['id', 'nombre', 'descripcion', 'estado'];
      this.cargarTodas();
    } else {
      // CASO B: Es USUARIO -> Ve SOLO SUS wallets
      this.displayedColumns = ['id', 'nombre', 'descripcion', 'estado'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.metodoService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          
          // 1. Cargar lista personal
          this.metodoService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
      this.metodoService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
