import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { TransaccionService } from '../../service/transaccion.service';
import { WalletService } from '../../service/wallet.service';
import { UsuarioService } from '../../service/usuario.service';
import { ComercioService } from '../../service/comercio.service';
import { TipoCambioService } from '../../service/tipo-cambio.service';
import { Transaccion } from '../../model/Transaccion';
import { LoginService } from '../../service/login-service';
import { Wallet } from '../../model/Wallet';
import { TipoCambio } from '../../model/TipoCambio';
import { Usuario } from '../../model/Usuario';
import { Comercio } from '../../model/Comercio';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { CryptoPricesComponent } from '../finanzas/crypto-prices/crypto-prices.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, RouterLink, ChatbotComponent, CryptoPricesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // KPIs Generales
  totalUsuarios: number = 0;
  saldoTotal: number = 0;
  ventasTotales: number = 0;
  transaccionesRecientes: Transaccion[] = [];

  // KPIs Admin BI
  volumenTotal: number = 0;
  ingresosEstimados: number = 0;
  transaccionesHoyCount: number = 0;

  // Gráficos Data
  tendenciaData: { fecha: string, monto: number, x: number, y: number }[] = [];
  distribucionCripto: { nombre: string, porcentaje: number, color: string, monto: number }[] = [];
  topUsuarios: { nombre: string, total: number, transacciones: number }[] = [];

  // SVG Chart Paths
  lineChartPath: string = '';
  fillChartPath: string = ''; // For the gradient area under the line

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
    private comercioService: ComercioService,
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
      forkJoin({
        usuarios: this.usuarioService.obtenerTodos(),
        transacciones: this.transaccionService.obtenerTodos()
      }).subscribe(({ usuarios, transacciones }) => {
        this.procesarDatosAdmin(usuarios, transacciones);
      });

    } else if (this.isComercio) {
      // First, get the comercio for this user
      this.comercioService.obtenerPorUsuario(this.usuarioIdActual).subscribe((comercios: Comercio[]) => {
        if (comercios && comercios.length > 0) {
          const comercio = comercios[0]; // Get the first comercio for this user

          // Now get transactions for this specific comercio
          this.transaccionService.obtenerPorComercio(comercio.comercioId!).subscribe(data => {
            this.ventasTotales = data.reduce((acc, tx) => acc + tx.montoTotalFiat, 0);
            this.transaccionesRecientes = this.filtrarTransaccionesDelDia(data);
          });
        }
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

  private procesarDatosAdmin(usuarios: Usuario[], transacciones: Transaccion[]) {
    // 1. Usuarios Registrados
    this.totalUsuarios = usuarios.length;

    // 2. Volumen Total y Transacciones Hoy
    this.volumenTotal = transacciones.reduce((acc, tx) => acc + (tx.montoTotalFiat || 0), 0);
    this.ingresosEstimados = this.volumenTotal * 0.01; // 1% fee

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    this.transaccionesHoyCount = transacciones.filter(tx => {
      const fecha = new Date(tx.fechaTransaccion || '');
      return fecha >= hoy;
    }).length;

    // 3. Tendencia de Transacciones (Últimos 7 días)
    const diasMap = new Map<string, number>();
    const diasOrdenados: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      diasMap.set(key, 0);
      diasOrdenados.push(key);
    }

    transacciones.forEach(tx => {
      if (!tx.fechaTransaccion) return;
      const key = tx.fechaTransaccion.split('T')[0];
      if (diasMap.has(key)) {
        diasMap.set(key, (diasMap.get(key) || 0) + (tx.montoTotalFiat || 0));
      }
    });

    // Configuración del Gráfico SVG (ViewBox 0 0 500 150)
    // Usamos coordenadas fijas para asegurar que no se desborde
    const width = 500;
    const height = 150;
    const padding = 10;
    const maxVal = Math.max(...Array.from(diasMap.values()), 10); // Min 10 to avoid flatline at 0

    this.tendenciaData = diasOrdenados.map((fecha, index) => {
      const monto = diasMap.get(fecha) || 0;
      // X: distribuido uniformemente
      const x = (index / (diasOrdenados.length - 1)) * (width - 2 * padding) + padding;
      // Y: invertido (0 es arriba)
      const y = height - padding - ((monto / maxVal) * (height - 2 * padding));
      return { fecha, monto, x, y };
    });

    // Construir Path SVG (Línea)
    if (this.tendenciaData.length > 1) {
      this.lineChartPath = 'M ' + this.tendenciaData.map(p => `${p.x},${p.y}`).join(' L ');
      // Area bajo la curva (para gradiente)
      this.fillChartPath = `${this.lineChartPath} L ${this.tendenciaData[this.tendenciaData.length - 1].x},${height} L ${this.tendenciaData[0].x},${height} Z`;
    } else {
      this.lineChartPath = '';
      this.fillChartPath = '';
    }

    // 4. Distribución de Criptos (Dinámico real)
    const criptoMap = new Map<string, number>();
    transacciones.forEach(tx => {
      // Usar el código real de la transacción. Si es null, 'UNKNOWN'
      const codigo = tx.codigoMoneda || 'UNKNOWN';
      criptoMap.set(codigo, (criptoMap.get(codigo) || 0) + (tx.montoTotalFiat || 0));
    });

    const totalCriptoVol = Array.from(criptoMap.values()).reduce((a, b) => a + b, 0) || 1;

    // Paleta de colores profesional para criptos
    const colorPalette = ['#F7931A', '#627EEA', '#26A17B', '#E91E63', '#9C27B0', '#3F51B5'];

    this.distribucionCripto = Array.from(criptoMap.entries())
      .map(([nombre, monto], index) => ({
        nombre,
        monto,
        porcentaje: (monto / totalCriptoVol) * 100,
        color: colorPalette[index % colorPalette.length]
      }))
      .sort((a, b) => b.monto - a.monto);

    // 5. Top Usuarios
    const userMap = new Map<number, { nombre: string, total: number, count: number }>();
    transacciones.forEach(tx => {
      if (!tx.usuarioId) return;
      if (!userMap.has(tx.usuarioId)) {
        const u = usuarios.find(us => us.usuarioId === tx.usuarioId);
        userMap.set(tx.usuarioId, {
          nombre: u ? `${u.nombre} ${u.apellido}` : `Usuario ${tx.usuarioId}`,
          total: 0,
          count: 0
        });
      }
      const entry = userMap.get(tx.usuarioId)!;
      entry.total += tx.montoTotalFiat || 0;
      entry.count++;
    });

    this.topUsuarios = Array.from(userMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(u => ({
        nombre: u.nombre,
        total: u.total,
        transacciones: u.count
      }));

    // Recientes (Admin ve todo)
    this.transaccionesRecientes = transacciones
      .sort((a, b) => new Date(b.fechaTransaccion || 0).getTime() - new Date(a.fechaTransaccion || 0).getTime())
      .slice(0, 5);
  }
}
