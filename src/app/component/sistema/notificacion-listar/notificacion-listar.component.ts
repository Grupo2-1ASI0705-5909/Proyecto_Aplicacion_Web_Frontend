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
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';

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
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private notificacionService: NotificacionService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,   // Usamos este para leer el token
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.verificarRolYCargar();
  }

  verificarRolYCargar() {
    // 1. Verificamos si es ADMIN
    const roles = this.loginService.showRole();
    // Ajusta 'ADMINISTRADOR' según cómo se llame en tu token/BD
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      // CASO A: Si es ADMIN, traemos TODAS
      // (Asegúrate de agregar 'destinatario' a las columnas si quieres ver a quién pertenece)
      this.displayedColumns = ['titulo', 'mensaje', 'fecha', 'estado', 'acciones'];
      this.cargarTodas();
    } else {
      // CASO B: Si es USUARIO, buscamos su ID y traemos solo las suyas
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.notificacionService.obtenerTodos().subscribe(data => {
      this.ordenarYMostrar(data);
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          
          // Llamamos al servicio usando el ID encontrado
          this.notificacionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            this.ordenarYMostrar(data);
          });
        }
      });
    }
  }

  ordenarYMostrar(data: Notificacion[]) {
    this.dataSource.data = data.sort((a, b) => 
      (b.fechaEnvio ? new Date(b.fechaEnvio).getTime() : 0) - 
      (a.fechaEnvio ? new Date(a.fechaEnvio).getTime() : 0)
    );
  }

  marcarLeida(n: Notificacion) {
    if (n.notificacionId && !n.leido) {
      this.notificacionService.marcarComoLeida(n.notificacionId).subscribe({
        next: () => {
          this.snackBar.open('Marcada como leída', 'Cerrar', { duration: 2000 });
          // Recargamos según el rol que tengamos
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => console.error(err)
      });
    }
  }
  
  // Solo para administradores (según tu backend)
  eliminar(id: number) {
    if (confirm('¿Borrar esta notificación?')) {
      this.notificacionService.eliminar(id).subscribe(() => {
        this.snackBar.open('Eliminada', 'Cerrar', { duration: 2000 });
        // Recargamos según el rol que tengamos
        this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
      });
    }
  }
}
