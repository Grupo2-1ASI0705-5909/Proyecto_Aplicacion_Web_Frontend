import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { WalletService } from '../../../service/wallet.service';
import { TransaccionService } from '../../../service/transaccion.service';
import { Wallet } from '../../../model/Wallet';
import { Transaccion } from '../../../model/Transaccion';

@Component({
  selector: 'app-wallet-detalle',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './wallet-detalle.component.html',
  styleUrl: './wallet-detalle.component.css'
})
export class WalletDetalleComponent implements OnInit {
  wallet: Wallet | null = null;
  transacciones: Transaccion[] = [];
  cargando = true;
  displayedColumns: string[] = ['fecha', 'comercio', 'monto', 'estado'];

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private transaccionService: TransaccionService
  ) { }

  ngOnInit(): void {
    const walletId = Number(this.route.snapshot.params['id']);
    this.cargarDatos(walletId);
  }

  cargarDatos(walletId: number): void {
    this.cargando = true;

    // Cargar wallet
    this.walletService.obtenerPorId(walletId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;

        // Cargar transacciones del usuario de esta wallet
        if (wallet.usuarioId) {
          this.transaccionService.obtenerTodos().subscribe({
            next: (transacciones) => {
              // Filtrar transacciones del mismo usuario
              this.transacciones = transacciones.filter(t =>
                t.usuarioId === wallet.usuarioId
              );
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error al cargar transacciones:', error);
              this.cargando = false;
            }
          });
        } else {
          this.cargando = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar wallet:', error);
        this.cargando = false;
      }
    });
  }

  getColorEstado(estado: string): string {
    const colores: any = {
      'COMPLETADA': 'primary',
      'PENDIENTE': 'warn',
      'CANCELADA': 'accent'
    };
    return colores[estado] || 'warn';
  }
}
