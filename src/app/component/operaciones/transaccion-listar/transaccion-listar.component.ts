import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TransaccionService } from '../../../service/transaccion.service';
import { Transaccion } from '../../../model/Transaccion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransaccionDetalleDialogComponent } from '../transaccion-detalle-dialog/transaccion-detalle-dialog.component';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';


@Component({
  selector: 'app-transaccion-listar',
  standalone: true,
  imports: [CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule, 
    MatCardModule, MatChipsModule,MatPaginator,MatDialogModule],
  templateUrl: './transaccion-listar.component.html',
  styleUrl: './transaccion-listar.component.css'
})
export class TransaccionListarComponent implements OnInit{
dataSource = new MatTableDataSource<Transaccion>();
  displayedColumns: string[] = ['id', 'fecha', 'comercio', 'monto', 'moneda', 'estado', 'acciones'];
  
  totalFiat: number = 0;
  totalCripto: number = 0;
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(private transaccionService: TransaccionService,private snackBar: MatSnackBar,private dialog: MatDialog,private loginService: LoginService,    // Inyectado
    private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.verificarPermisosYCargar();
  }

  verificarPermisosYCargar() {
    // 1. Verificamos el Rol
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      // CASO A: Es ADMIN -> Carga TODO (y quizás agrega columna de usuario si quisieras)
      this.cargarTodas();
    } else {
      // CASO B: Es USUARIO -> Busca su ID y carga lo suyo
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.transaccionService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      // Como Admin ve todo, los totales personales no aplican (o se ponen en 0)
      this.totalFiat = 0;
      this.totalCripto = 0;
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          
          // 1. Cargar lista filtrada
          this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            this.dataSource.data = data;
          });

          // 2. Cargar sus totales
          this.transaccionService.calcularTotalFiatPorUsuario(this.usuarioIdActual).subscribe(t => this.totalFiat = t);
          this.transaccionService.calcularTotalCriptoPorUsuario(this.usuarioIdActual).subscribe(t => this.totalCripto = t);
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      this.transaccionService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Transacción eliminada', 'Cerrar', { duration: 3000 });
          // Recargamos según el rol que tenga
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias(); // Reutiliza la lógica de carga correcta
        },
        error: (err) => {
          console.error('Error eliminando:', err);
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  verDetalle(transaccion: Transaccion) {
    this.dialog.open(TransaccionDetalleDialogComponent, {
      width: '500px',
      data: transaccion // Le pasamos toda la info
    });
  }

  getColorEstado(estado: string): string {
    switch(estado) {
      case 'COMPLETADA': return 'accent'; 
      case 'PENDIENTE': return 'warn';    
      default: return 'primary';
    }
  }
}
