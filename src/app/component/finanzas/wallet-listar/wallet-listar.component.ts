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
  usuarioIdActual = 1; // ID temporal

  constructor(
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar lista de wallets
    this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
      this.dataSource.data = data;
    });

    // 2. Cargar saldo total estimado
    this.walletService.obtenerSaldoTotalUsuario(this.usuarioIdActual).subscribe(total => {
      this.saldoTotal = total;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta wallet?')) {
      this.walletService.eliminar(id).subscribe({
        next: () => {
          this.snackBar.open('Wallet eliminada', 'Cerrar', { duration: 3000 });
          this.cargarDatos();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
