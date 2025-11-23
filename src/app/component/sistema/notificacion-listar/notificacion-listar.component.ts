import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Notificacion } from '../../../model/Notificacion';
import { NotificacionService } from '../../../service/notificacion.service';

@Component({
  selector: 'app-notificacion-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './notificacion-listar.component.html',
  styleUrl: './notificacion-listar.component.css'
})
export class NotificacionListarComponent implements OnInit{
dataSource = new MatTableDataSource<Notificacion>();
  displayedColumns: string[] = ['titulo', 'mensaje', 'fecha', 'estado', 'acciones'];
  
  usuarioIdActual = 1; // ID temporal del usuario logueado

  constructor(
    private notificacionService: NotificacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    // Obtenemos las notificaciones SOLO del usuario actual
    this.notificacionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
      // Ordenamos por fecha (las más nuevas primero)
      this.dataSource.data = data.sort((a, b) => 
        (b.fechaEnvio ? new Date(b.fechaEnvio).getTime() : 0) - 
        (a.fechaEnvio ? new Date(a.fechaEnvio).getTime() : 0)
      );
    });
  }

  marcarLeida(n: Notificacion) {
    if (n.notificacionId && !n.leido) {
      this.notificacionService.marcarComoLeida(n.notificacionId).subscribe({
        next: () => {
          this.snackBar.open('Notificación marcada como leída', 'Cerrar', { duration: 2000 });
          this.cargarNotificaciones(); // Refrescamos
        },
        error: (err) => console.error(err)
      });
    }
  }
  
  // Solo para administradores (según tu backend)
  eliminar(id: number) {
    if (confirm('¿Borrar esta notificación?')) {
      this.notificacionService.eliminar(id).subscribe(() => {
        this.cargarNotificaciones();
      });
    }
  }
}
