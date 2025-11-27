import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TransaccionService } from '../../../service/transaccion.service';
import { Transaccion } from '../../../model/Transaccion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransaccionDetalleDialogComponent } from '../transaccion-detalle-dialog/transaccion-detalle-dialog.component';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComercioService } from '../../../service/comercio.service';

@Component({
  selector: 'app-transaccion-listar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatPaginatorModule, MatDialogModule,
    MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './transaccion-listar.component.html',
  styleUrl: './transaccion-listar.component.css'
})
export class TransaccionListarComponent implements OnInit {
  dataSource = new MatTableDataSource<Transaccion>();
  displayedColumns: string[] = ['id', 'fecha', 'comercio', 'monto', 'moneda', 'estado', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalFiat: number = 0;
  totalCripto: number = 0;
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;
  isComercio: boolean = false;

  // Filtros
  fechaInicio = new FormControl<Date | null>(null);
  fechaFin = new FormControl<Date | null>(null);
  estadoFiltro = new FormControl('');

  constructor(
    private transaccionService: TransaccionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private comercioService: ComercioService
  ) { }

  ngOnInit(): void {
    this.verificarPermisosYCargar();
    this.configurarFiltros();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  configurarFiltros() {
    this.dataSource.filterPredicate = (data: Transaccion, filter: string) => {
      const estadoSeleccionado = this.estadoFiltro.value;
      const inicio = this.fechaInicio.value;
      const fin = this.fechaFin.value;

      const matchEstado = !estadoSeleccionado || data.estado === estadoSeleccionado;

      let matchFecha = true;
      if (inicio && fin) {
        const fechaTx = new Date(data.fechaTransaccion || '');
        // Ajustar fin al final del día
        const finAjustado = new Date(fin);
        finAjustado.setHours(23, 59, 59);
        matchFecha = fechaTx >= inicio && fechaTx <= finAjustado;
      }

      return matchEstado && matchFecha;
    };
  }

  aplicarFiltros() {
    this.dataSource.filter = '' + Math.random();
  }

  limpiarFiltros() {
    this.fechaInicio.setValue(null);
    this.fechaFin.setValue(null);
    this.estadoFiltro.setValue('');
    this.aplicarFiltros();
  }

  verificarPermisosYCargar() {
    this.isAdmin = this.loginService.isAdmin();
    this.isComercio = this.loginService.isComercio();

    if (this.isAdmin) {
      this.cargarTodas();
    } else if (this.isComercio) {
      this.cargarVentasComercio();
    } else {
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.transaccionService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      this.totalFiat = 0;
      this.totalCripto = 0;
    });
  }

  cargarVentasComercio() {
    this.usuarioIdActual = this.loginService.getUsuarioId();
    if (this.usuarioIdActual) {
      this.comercioService.obtenerPorUsuario(this.usuarioIdActual).subscribe(comercios => {
        if (comercios && comercios.length > 0) {
          const miComercio = comercios[0]; // Tomamos el primero
          if (miComercio.comercioId) {
            this.transaccionService.obtenerPorComercio(miComercio.comercioId).subscribe(data => {
              this.dataSource.data = data;

              // Calcular totales manualmente (Ventas)
              this.totalFiat = data.reduce((acc, t) => acc + t.montoTotalFiat, 0);
              this.totalCripto = data.reduce((acc, t) => acc + t.montoTotalCripto, 0);
            });
          }
        }
      });
    }
  }

  cargarSoloMias() {
    this.usuarioIdActual = this.loginService.getUsuarioId();

    if (this.usuarioIdActual) {
      // 1. Cargar lista filtrada
      this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
        this.dataSource.data = data;
      });

      // 2. Cargar sus totales
      this.transaccionService.calcularTotalFiatPorUsuario(this.usuarioIdActual).subscribe(t => this.totalFiat = t);
      this.transaccionService.calcularTotalCriptoPorUsuario(this.usuarioIdActual).subscribe(t => this.totalCripto = t);
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      this.transaccionService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Transacción eliminada', 'Cerrar', { duration: 3000 });
          this.verificarPermisosYCargar();
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
      data: transaccion
    });
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'COMPLETADA': return 'accent';
      case 'PENDIENTE': return 'warn';
      default: return 'primary';
    }
  }
}
