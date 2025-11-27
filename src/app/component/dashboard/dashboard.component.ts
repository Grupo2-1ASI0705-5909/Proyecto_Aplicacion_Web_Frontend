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
  transaccionesRecientes: Transaccion[] = [];

  usuarioIdActual = 1; // ID temporal para simular sesión

  constructor(
    private loginService: LoginService,
    private transaccionService: TransaccionService,
    private walletService: WalletService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarKPIs();
  }

  cargarKPIs() {
    // 1. Contar usuarios activos (KPI Administrativo)
    this.usuarioService.contarUsuariosActivos().subscribe(count => {
      this.totalUsuarios = count;
    });

    // 2. Calcular saldo total del usuario actual (KPI Personal)
    this.walletService.obtenerSaldoTotalUsuario(this.usuarioIdActual).subscribe(total => {
      this.saldoTotal = total;
    });

    // 3. Obtener últimas transacciones (Globales o del usuario)
    // Nota: Usamos obtenerRecientes del backend (requiere rol ADMIN en tu controlador,
    // si falla por permisos, podrías usar obtenerPorUsuario)
    this.transaccionService.obtenerRecientes().subscribe({
      next: (data) => {
        this.transaccionesRecientes = data.slice(0, 5); // Mostrar solo las 5 últimas
      },
      error: () => {
        // Fallback si no es admin: cargar las del usuario
        this.transaccionService.obtenerPorUsuario(this.usuarioIdActual).subscribe(data => {
          this.transaccionesRecientes = data.slice(0, 5);
        });
      }
    });
  }
}
