import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';

import { Wallet } from '../../../model/Wallet';
import { WalletService } from '../../../service/wallet.service';
import { WalletStateService } from '../../../service/wallet-state.service';
import { LoginService } from '../../../service/login-service';
import { UsuarioService } from '../../../service/usuario.service';
import { TipoCambioService } from '../../../service/tipo-cambio.service';
import { TipoCambio } from '../../../model/TipoCambio';

@Component({
  selector: 'app-wallet-listar',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatSnackBarModule,
    MatTooltipModule
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

  private walletsSubscription?: Subscription;
  private reloadSubscription?: Subscription;
  private tasasSubscription?: Subscription;
  private walletsActuales: Wallet[] = [];

  constructor(
    private walletService: WalletService,
    private walletStateService: WalletStateService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private tipoCambioService: TipoCambioService  // ✅ AGREGADO
  ) { }

  ngOnInit(): void {
    console.log('[INIT] WalletListarComponent inicializado');
    this.suscribirseAEstadoCompartido();
    this.suscribirseARecargas();
    this.suscribirseATasasEnVivo();  // ✅ NUEVO
    this.verificarPermisosYCargar();
  }

  ngOnDestroy(): void {
    this.walletsSubscription?.unsubscribe();
    this.reloadSubscription?.unsubscribe();
    this.tasasSubscription?.unsubscribe();  // ✅ LIMPIEZA
    console.log('[CLEANUP] WalletListarComponent destruido - suscripciones limpiadas');
  }

  suscribirseAEstadoCompartido() {
    this.walletsSubscription = this.walletStateService.wallets$.subscribe(wallets => {
      if (wallets.length > 0) {
        console.log('[STATE] Wallets actualizadas desde el estado compartido:', wallets);
        this.dataSource.data = wallets;
        this.walletsActuales = wallets;  // ✅ GUARDAR PARA CÁLCULO
      }
    });
  }

  suscribirseARecargas() {
    this.reloadSubscription = this.walletStateService.reload$.subscribe(shouldReload => {
      if (shouldReload) {
        console.log('[RELOAD] Recibida señal de recarga - actualizando desde backend');
        this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
      }
    });
  }

  // ✅ NUEVO: Suscripción a tasas en tiempo real
  suscribirseATasasEnVivo() {
    this.tasasSubscription = this.tipoCambioService.tasasEnTiempoReal$.subscribe(tasas => {
      console.log('[TASAS] Tasas actualizadas:', tasas);
      this.calcularPatrimonioConTasas(this.walletsActuales, tasas);
    });
  }

  // ✅ NUEVO: Calcular patrimonio con tasas en tiempo real
  private calcularPatrimonioConTasas(wallets: Wallet[], tasas: TipoCambio[]) {
    if (!wallets || wallets.length === 0) {
      this.saldoTotal = 0;
      return;
    }

    let total = 0;

    wallets.forEach(wallet => {
      const codigoCripto = wallet.criptomoneda?.codigo;
      if (!codigoCripto) return;

      // Buscar la tasa de la cripto a USD
      const tasa = tasas.find(t =>
        t.desdeCodigo === codigoCripto && t.hastaCodigo === 'USD'
      );

      if (tasa) {
        const valorEnUSD = wallet.saldo * tasa.tasa;
        total += valorEnUSD;
        console.log(`[CALCULO] ${codigoCripto}: ${wallet.saldo} × $${tasa.tasa} = $${valorEnUSD}`);
      } else {
        console.warn(`[CALCULO] No se encontró tasa para ${codigoCripto}/USD`);
      }
    });

    this.saldoTotal = total;
    console.log('[PATRIMONIO] Total calculado con tasas en vivo: $', total.toFixed(2));
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
      this.walletsActuales = data;  // ✅ GUARDAR
      this.walletStateService.setWallets(data);
    });
  }

  cargarSoloMias() {
    const email = this.loginService.getUsuarioActual();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;

          // Cargar wallets del usuario
          this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
            console.log('[DATA] Wallets del usuario cargadas desde backend:', data);
            this.dataSource.data = data;
            this.walletsActuales = data;  // ✅ GUARDAR PARA CÁLCULO CON TASAS
            this.walletStateService.setWallets(data);
          });
        }
      });
    }
  }

  eliminar(wallet: Wallet) {
    if (wallet.saldo && wallet.saldo > 0) {
      this.snackBar.open(
        `No puedes eliminar una wallet con saldo positivo. Saldo actual: ${wallet.saldo}`,
        'Cerrar',
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la wallet de ${wallet.criptomoneda?.nombre}?`)) {
      this.walletService.eliminar(wallet.walletId!).subscribe({
        next: () => {
          this.snackBar.open('Wallet eliminada correctamente', 'Cerrar', { duration: 3000 });
          this.isAdmin ? this.cargarTodas() : this.cargarSoloMias();
        },
        error: (err) => {
          const mensaje = err.error?.message || err.message || 'Error al eliminar la wallet';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
          console.error('Error eliminando wallet:', err);
        }
      });
    }
  }
}
