import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Comercio } from '../../../model/Comercio';
import { ComercioService } from '../../../service/comercio.service';

@Component({
  selector: 'app-comercio-listar',
  standalone: true,
  imports: [CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSnackBarModule],
  templateUrl: './comercio-listar.component.html',
  styleUrl: './comercio-listar.component.css'
})
export class ComercioListarComponent implements OnInit {
  dataSource = new MatTableDataSource<Comercio>();
  displayedColumns: string[] = ['id', 'nombre', 'ruc', 'categoria', 'estado', 'acciones'];

  constructor(
    private comercioService: ComercioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarComercios();
  }

  cargarComercios() {
    this.comercioService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este comercio?')) {
      this.comercioService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Comercio eliminado', 'Cerrar', { duration: 3000 });
          this.cargarComercios();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
