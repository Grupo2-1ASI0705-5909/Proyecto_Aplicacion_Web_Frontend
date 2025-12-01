import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransaccionService } from '../../service/transaccion.service';
import { WalletService } from '../../service/wallet.service';
import { UsuarioService } from '../../service/usuario.service';
import { TipoCambioService } from '../../service/tipo-cambio.service';
import { Transaccion } from '../../model/Transaccion';
import { LoginService } from '../../service/login-service';
import { Wallet } from '../../model/Wallet';
import { TipoCambio } from '../../model/TipoCambio';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalUsuarios: number = 0;
  saldoTotal: number = 0;
  ventasTotales: number = 0;
  transaccionesRecientes: Transaccion[] = [];

  usuarioIdActual: number | null = null;
  isAdmin = false;
  isComercio = false;

  private tasasSubscription?: Subscription;
  private walletsActuales: Wallet[] = [];

  constructor(
    private loginService: LoginService,
    private transaccionService: TransaccionService,
    private walletService: WalletService,
    private usuarioService: UsuarioService,
    private tipoCambioService: TipoCambioService
  ) { }

  ngOnInit(): void {
    const email = this.loginService.getUsuarioActual();
    this.isAdmin = this.loginService.isAdmin();
    this.isComercio = this.loginService.isComercio();

    if (email) {
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          this.usuarioIdActual = usuario.usuarioId;
          this.cargarKPIs();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.tasasSubscription?.unsubscribe();
  }

  private suscribirseATasasEnVivo() {
    this.tasasSubscription = this.tipoCambioService.tasasEnTiempoReal$.subscribe(tasas => {
      this.calcularPatrimonioConTasas(this.walletsActuales, tasas);
    });
  }

  private calcularPatrimonioConTasas(wallets: Wallet[], tasas: TipoCambio[]) {
    if (!wallets || wallets.length === 0) {
      this.saldoTotal = 0;
      return;
    }

    let total = 0;
    wallets.forEach(wallet => {
      const codigoCripto = wallet.criptomoneda?.codigo;
      if (!codigoCripto) return;

      const tasa = tasas.find(t => t.desdeCodigo === codigoCripto && t.hastaCodigo === 'USD');
      if (tasa) {
        total += wallet.saldo * tasa.tasa;
      }
    });

    this.saldoTotal = total;
  }

  private filtrarTransaccionesDelDia(transacciones: Transaccion[]): Transaccion[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    return transacciones.filter(tx => {
      if (!tx.fechaTransaccion) return false;
      const fechaTx = new Date(tx.fechaTransaccion);
      return fechaTx >= hoy && fechaTx < manana;
    });
  }

  cargarKPIs() {
    if (!this.usuarioIdActual) return;

    if (this.isAdmin) {
      this.usuarioService.contarUsuariosActivos().subscribe(count => this.totalUsuarios = count);
      this.transaccionService.obtenerRecientes().subscribe(data => {
        this.transaccionesRecientes = this.filtrarTransaccionesDelDia(data);
      });
    } else if (this.isComercio) {
      this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
        this.ventasTotales = data.reduce((acc, tx) => acc + tx.montoTotalFiat, 0);
        this.transaccionesRecientes = this.filtrarTransaccionesDelDia(data);
      });
    } else {
      this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe(wallets => {
        this.walletsActuales = wallets;
        this.suscribirseATasasEnVivo();
      });

      this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
        this.transaccionesRecientes = this.filtrarTransaccionesDelDia(data);
      });
    }
  }
}
