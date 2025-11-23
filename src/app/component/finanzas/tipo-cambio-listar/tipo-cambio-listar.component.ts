import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TipoCambioService } from '../../../service/tipo-cambio.service';
import { TipoCambio } from '../../../model/TipoCambio';

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

  constructor(
    private tipoCambioService: TipoCambioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarTiposCambio();
  }

  cargarTiposCambio() {
    this.tipoCambioService.obtenerTodos().subscribe(data => {
      // Ordenamos por fecha descendente para ver lo más reciente primero
      this.dataSource.data = data.sort((a, b) => 
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
      );
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
