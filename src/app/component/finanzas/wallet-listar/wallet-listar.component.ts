import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';


import { Wallet } from '../../../model/Wallet';
import { WalletService } from '../../../service/wallet.service';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-wallet-listar', 
  standalone: true, 
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './wallet-listar.component.html', 
  styleUrl: './wallet-listar.component.css'
})
export class WalletListarComponent implements OnInit{
dataSource = new MatTableDataSource<Wallet>();
  displayedColumns: string[] = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
  
  saldoTotal: number = 0;

  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private walletService: WalletService,
    private snackBar: MatSnackBar,
    private loginService: LoginService, // Para saber quién es
    private usuarioService: UsuarioService, // Para buscar su ID
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
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarTodas();
    } else {
      // CASO B: Es USUARIO -> Ve SOLO SUS wallets
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.walletService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      // (Opcional) Podrías sumar todos los saldos aquí si quisieras un total global
      this.saldoTotal = 0; 
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          
          // 1. Cargar lista personal
          this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            this.dataSource.data = data;
          });

          // 2. Cargar saldo total personal
          this.walletService.obtenerSaldoTotalUsuario(this.usuarioIdActual).subscribe(total => {
            this.saldoTotal = total;
          });
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta wallet?')) {
      this.walletService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Wallet eliminada', 'Cerrar', { duration: 3000 });
          // Recargamos usando la lógica correspondiente al rol
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
