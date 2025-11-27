import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TransaccionService } from '../../service/transaccion.service';
import { WalletService } from '../../service/wallet.service';
import { UsuarioService } from '../../service/usuario.service';
import { Transaccion } from '../../model/Transaccion';
import { LoginService } from '../../service/login-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalUsuarios: number = 0;
  saldoTotal: number = 0;
  ventasTotales: number = 0; // Nuevo KPI para comercios
  transaccionesRecientes: Transaccion[] = [];

  usuarioIdActual: number | null = null;
  isAdmin = false;
  isComercio = false;

  constructor(
    private loginService: LoginService,
    private transaccionService: TransaccionService,
    private walletService: WalletService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioIdActual = this.loginService.getUsuarioId();
    this.isAdmin = this.loginService.isAdmin();
    this.isComercio = this.loginService.isComercio();

    if (this.usuarioIdActual) {
      this.cargarKPIs();
    }
  }

  cargarKPIs() {
    if (!this.usuarioIdActual) return;

    // 1. KPI Principal: Usuarios (Admin) o Saldo (Cliente) o Ventas (Comercio)
    if (this.isAdmin) {
      this.usuarioService.contarUsuariosActivos().subscribe(count => this.totalUsuarios = count);
    } else if (this.isComercio) {
      // Para comercios, intentamos obtener transacciones donde actuó como comercio
      // Asumiendo que obtenerPorUsuario trae todas, filtramos o sumamos
      this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
        // Filtrar donde el usuario es el receptor (lógica simulada si no hay campo directo)
        // O simplemente sumar todo lo positivo
        this.ventasTotales = data.reduce((acc, tx) => acc + tx.montoTotalFiat, 0);
        this.transaccionesRecientes = data.slice(0, 5);
      });
    } else {
      // Cliente normal
      this.walletService.obtenerSaldoTotalUsuario(this.usuarioIdActual).subscribe(total => {
        this.saldoTotal = total;
      });
    }

    // 2. Cargar transacciones recientes si no se cargaron arriba
    if (!this.isComercio) {
      if (this.isAdmin) {
        this.transaccionService.obtenerRecientes().subscribe(data => this.transaccionesRecientes = data.slice(0, 5));
      } else {
        this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => this.transaccionesRecientes = data.slice(0, 5));
      }
    }
  }
}
