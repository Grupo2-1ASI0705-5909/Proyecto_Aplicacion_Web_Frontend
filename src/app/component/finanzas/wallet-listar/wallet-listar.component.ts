import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Wallet } from '../../../model/Wallet';
import { WalletService } from '../../../service/wallet.service';
import { WalletStateService } from '../../../service/wallet-state.service';
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
export class WalletListarComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Wallet>();
  displayedColumns: string[] = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];

  saldoTotal: number = 0;

  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  // Suscripciones para limpiar en OnDestroy
  private walletsSubscription?: Subscription;
  private reloadSubscription?: Subscription;

  constructor(
    private walletService: WalletService,
    private walletStateService: WalletStateService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    console.log('[INIT] WalletListarComponent inicializado');

    // Suscribirse a los cambios del estado compartido
    this.suscribirseAEstadoCompartido();

    // Suscribirse al trigger de recarga
    this.suscribirseARecargas();

    // Cargar datos iniciales
    this.verificarPermisosYCargar();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones al destruir el componente
    this.walletsSubscription?.unsubscribe();
    this.reloadSubscription?.unsubscribe();
    console.log('[CLEANUP] WalletListarComponent destruido - suscripciones limpiadas');
  }

  /**
   * Se suscribe al estado compartido de wallets
   * Cada vez que otro componente actualice una wallet, este componente se enterará
   */
  suscribirseAEstadoCompartido() {
    this.walletsSubscription = this.walletStateService.wallets$.subscribe(wallets => {
      if (wallets.length > 0) {
        console.log('[STATE] Wallets actualizadas desde el estado compartido:', wallets);
        this.dataSource.data = wallets;
        this.calcularSaldoTotal(wallets);
      }
    });
  }

  /**
   * Se suscribe al trigger de recarga
   * Cuando otro componente actualice el backend, este recargará los datos
   */
  suscribirseARecargas() {
    this.reloadSubscription = this.walletStateService.reload$.subscribe(shouldReload => {
      if (shouldReload) {
        console.log('[RELOAD] Recibida señal de recarga - actualizando desde backend');
        this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
      }
    });
  }

  calcularSaldoTotal(wallets: Wallet[]) {
    this.saldoTotal = wallets.reduce((sum, wallet) => sum + wallet.saldo, 0);
  }

  verificarPermisosYCargar() {
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarTodas();
    } else {
      this.displayedColumns = ['id', 'cripto', 'direccion', 'saldo', 'estado', 'acciones'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.walletService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      this.saldoTotal = 0;

      // Actualizar el estado compartido
      this.walletStateService.setWallets(data);
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
            console.log('[DATA] Wallets del usuario cargadas desde backend:', data);
            this.dataSource.data = data;

            // ACTUALIZAR EL ESTADO COMPARTIDO para que otros componentes lo vean
            this.walletStateService.setWallets(data);
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
