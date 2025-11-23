import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Criptomoneda } from '../../../model/Criptomoneda';
import { CriptomonedaService } from '../../../service/criptomoneda.service';

@Component({
  selector: 'app-cripto-listar',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './cripto-listar.component.html',
  styleUrl: './cripto-listar.component.css'
})
export class CriptoListarComponent implements OnInit{
dataSource = new MatTableDataSource<Criptomoneda>();
  displayedColumns: string[] = ['id', 'codigo', 'nombre', 'decimales', 'estado', 'acciones'];

  constructor(
    private criptoService: CriptomonedaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCriptos();
  }

  cargarCriptos() {
    this.criptoService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta criptomoneda?')) {
      this.criptoService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Criptomoneda eliminada', 'Cerrar', { duration: 3000 });
          this.cargarCriptos();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
