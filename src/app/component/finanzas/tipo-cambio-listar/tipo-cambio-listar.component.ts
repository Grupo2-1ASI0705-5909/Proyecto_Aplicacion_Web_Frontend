import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TipoCambioService } from '../../../service/tipo-cambio.service';
import { TipoCambio } from '../../../model/TipoCambio';
import { LoginService } from '../../../service/login-service';

@Component({
  selector: 'app-tipo-cambio-listar',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule, 
    MatSnackBarModule
  ],
  templateUrl: './tipo-cambio-listar.component.html',
  styleUrl: './tipo-cambio-listar.component.css'
})
export class TipoCambioListarComponent implements OnInit{
dataSource = new MatTableDataSource<TipoCambio>();
  displayedColumns: string[] = ['id', 'par', 'tasa', 'fecha', 'fuente', 'acciones'];
  isAdmin: boolean = false;

  constructor(
    private tipoCambioService: TipoCambioService,
    private snackBar: MatSnackBar,private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.verificarPermisos();
    this.cargarTiposCambio();
  }

  verificarPermisos() {
    // 1. Verificamos el Rol
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    // 2. Si NO es Admin, quitamos la columna de acciones (no puede borrar)
    if (!this.isAdmin) {
      this.displayedColumns = ['id', 'par', 'tasa', 'fecha', 'fuente'];
    }
  }

  cargarTiposCambio() {
    // Cargamos la lista global para todos
    this.tipoCambioService.obtenerTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a, b) => 
          new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        );
      },
      error: (err) => {
        console.error('Error cargando tipos de cambio:', err);
        // Si el backend bloquea a usuarios normales (403), podrías manejarlo aquí
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este registro de tasa?')) {
      this.tipoCambioService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Registro eliminado', 'Cerrar', { duration: 3000 });
          this.cargarTiposCambio();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
