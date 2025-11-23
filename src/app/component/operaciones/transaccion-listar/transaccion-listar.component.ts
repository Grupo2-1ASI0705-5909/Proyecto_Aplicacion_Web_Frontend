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
  usuarioIdActual: number = 1; 

  constructor(private transaccionService: TransaccionService,private snackBar: MatSnackBar,private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
      this.dataSource.data = data;
    });

    this.transaccionService.calcularTotalFiatPorUsuario(this.usuarioIdActual).subscribe(total => {
      this.totalFiat = total;
    });

    this.transaccionService.calcularTotalCriptoPorUsuario(this.usuarioIdActual).subscribe(total => {
      this.totalCripto = total;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      this.transaccionService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Transacción eliminada', 'Cerrar', { duration: 3000 });
          this.cargarDatos(); // Recargamos la lista y los totales
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
