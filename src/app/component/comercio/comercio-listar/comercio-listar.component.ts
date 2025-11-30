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
<<<<<<< HEAD
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';
=======
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8

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
<<<<<<< HEAD
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private comercioService: ComercioService,
    private snackBar: MatSnackBar,
    private loginService: LoginService, // Para saber quién es
        private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.verificarPermisosYCargar();
  }

  verificarPermisosYCargar() {
    // 1. Verificamos el Rol
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      // CASO A: Es ADMIN -> Ve TODAS las wallets del sistema
      // Agregamos columna propietario para que el admin sepa de quién es
      this.displayedColumns = ['id', 'nombre', 'ruc', 'categoria', 'estado', 'acciones'];
      this.cargarTodas();
    } else {
      // CASO B: Es USUARIO -> Ve SOLO SUS wallets
      this.displayedColumns = ['id', 'nombre', 'ruc', 'categoria', 'estado', 'acciones'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
=======

  constructor(
    private comercioService: ComercioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarComercios();
  }

  cargarComercios() {
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
    this.comercioService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

<<<<<<< HEAD
  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          
          // 1. Cargar lista personal
          this.comercioService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            this.dataSource.data = data;
          });
        }
      });
    }
  }

=======
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este comercio?')) {
      this.comercioService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Comercio eliminado', 'Cerrar', { duration: 3000 });
<<<<<<< HEAD
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
=======
          this.cargarComercios();
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
        },
        error: (err) => console.error(err)
      });
    }
  }
}
