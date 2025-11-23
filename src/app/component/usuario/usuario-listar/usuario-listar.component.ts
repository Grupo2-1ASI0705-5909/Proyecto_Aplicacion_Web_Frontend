import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../model/Usuario';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  imports: [CommonModule, RouterModule,
    MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './usuario-listar.component.html',
  styleUrl: './usuario-listar.component.css'
})
export class UsuarioListarComponent implements OnInit{
dataSource = new MatTableDataSource<Usuario>();
  displayedColumns: string[] = ['id', 'nombre', 'email', 'telefono', 'rol', 'acciones'];

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => {
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
        this.cargarUsuarios();
      });
    }
  }
}
