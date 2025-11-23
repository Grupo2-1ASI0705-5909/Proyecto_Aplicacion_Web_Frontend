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

  constructor(
    private metodoService: MetodoPagoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarMetodos();
  }

  cargarMetodos() {
    this.metodoService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
      this.metodoService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.cargarMetodos();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
