import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Notificacion } from '../../../model/Notificacion';
import { NotificacionService } from '../../../service/notificacion.service';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-notificacion-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notificacion-listar.component.html',
  styleUrl: './notificacion-listar.component.css'
})
export class NotificacionListarComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  notificacionesFiltradas: Notificacion[] = [];
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;
  cargando: boolean = true;
  filtroActual: 'todas' | 'noLeidas' = 'todas';

  constructor(
    private notificacionService: NotificacionService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.verificarRolYCargar();
  }

  verificarRolYCargar() {
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      this.cargarTodas();
    } else {
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.cargando = true;
    this.notificacionService.obtenerTodos().subscribe({
      next: (data) => {
        this.ordenarYMostrar(data);
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.snackBar.open('Error al cargar notificaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarSoloMias() {
    this.cargando = true;
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe({
        next: (usuario) => {
          if (usuario && usuario.usuarioId) {
            this.usuarioIdActual = usuario.usuarioId;

            this.notificacionService.obtenerPorUsuario(this.usuarioIdActual).subscribe({
              next: (data) => {
                this.ordenarYMostrar(data);
                this.cargando = false;
              },
              error: (err) => {
                console.error(err);
                this.cargando = false;
                this.snackBar.open('Error al cargar notificaciones', 'Cerrar', { duration: 3000 });
              }
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
        }
      });
    }
  }

  ordenarYMostrar(data: Notificacion[]) {
    this.notificaciones = data.sort((a, b) =>
      (b.fechaEnvio ? new Date(b.fechaEnvio).getTime() : 0) -
      (a.fechaEnvio ? new Date(a.fechaEnvio).getTime() : 0)
    );
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroActual === 'noLeidas') {
      this.notificacionesFiltradas = this.notificaciones.filter(n => !n.leido);
    } else {
      this.notificacionesFiltradas = this.notificaciones;
    }
  }

  cambiarFiltro(filtro: 'todas' | 'noLeidas') {
    this.filtroActual = filtro;
    this.aplicarFiltro();
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter(n => !n.leido).length;
  }

  marcarLeida(n: Notificacion, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (n.notificacionId && !n.leido) {
      this.notificacionService.marcarComoLeida(n.notificacionId).subscribe({
        next: () => {
          n.leido = true; // Actualizar localmente
          this.snackBar.open('Marcada como leída', 'Cerrar', { duration: 2000 });
          this.aplicarFiltro();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al marcar como leída', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }

  marcarTodasLeidas() {
    if (this.cantidadNoLeidas === 0) {
      this.snackBar.open('No hay notificaciones sin leer', 'Cerrar', { duration: 2000 });
      return;
    }

    if (this.usuarioIdActual) {
      this.notificacionService.marcarTodasComoLeidas(this.usuarioIdActual).subscribe({
        next: () => {
          this.snackBar.open('Todas las notificaciones marcadas como leídas', 'Cerrar', { duration: 2000 });
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al marcar todas como leídas', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  eliminar(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (confirm('¿Deseas eliminar esta notificación?')) {
      this.notificacionService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Notificación eliminada', 'Cerrar', { duration: 2000 });
          this.notificaciones = this.notificaciones.filter(n => n.notificacionId !== id);
          this.aplicarFiltro();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar notificación', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }

  getIconoNotificacion(titulo: string): string {
    if (titulo.includes('Recibida') || titulo.includes('recibido')) {
      return 'arrow_downward';
    } else if (titulo.includes('Enviada') || titulo.includes('enviado')) {
      return 'arrow_upward';
    } else if (titulo.includes('Error') || titulo.includes('Cancelad')) {
      return 'error_outline';
    } else if (titulo.includes('Confirmad') || titulo.includes('Éxito')) {
      return 'check_circle';
    }
    return 'notifications';
  }

  getColorNotificacion(titulo: string): string {
    if (titulo.includes('Recibida') || titulo.includes('recibido')) {
      return '#4caf50'; // Verde
    } else if (titulo.includes('Enviada') || titulo.includes('enviado')) {
      return '#2196f3'; // Azul
    } else if (titulo.includes('Error') || titulo.includes('Cancelad')) {
      return '#f44336'; // Rojo
    } else if (titulo.includes('Confirmad') || titulo.includes('Éxito')) {
      return '#4caf50'; // Verde
    }
    return '#ff9800'; // Naranja (default)
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '';

    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diff = ahora.getTime() - fechaNotif.getTime();

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Ahora mismo';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    if (dias < 7) return `Hace ${dias} d`;

    return fechaNotif.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
