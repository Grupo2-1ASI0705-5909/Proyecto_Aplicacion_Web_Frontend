import { Routes } from '@angular/router';
import { UsuarioListarComponent } from './component/usuario/usuario-listar/usuario-listar.component';
import { UsuarioCrearComponent } from './component/usuario/usuario-crear/usuario-crear.component';
import { TransaccionListarComponent } from './component/operaciones/transaccion-listar/transaccion-listar.component';
import { TransaccionCrearComponent } from './component/operaciones/transaccion-crear/transaccion-crear.component';
import { PlanPagoListarComponent } from './component/operaciones/plan-pago-listar/plan-pago-listar.component';
import { PlanPagoCrearComponent } from './component/operaciones/plan-pago-crear/plan-pago-crear.component';
import { MetodoPagoListarComponent } from './component/operaciones/metodo-pago-listar/metodo-pago-listar.component';
import { MetodoPagoCrearComponent } from './component/operaciones/metodo-pago-crear/metodo-pago-crear.component';
import { WalletListarComponent } from './component/finanzas/wallet-listar/wallet-listar.component';
import { WalletCrearComponent } from './component/finanzas/wallet-crear/wallet-crear.component';
import { WalletDetalleComponent } from './component/finanzas/wallet-detalle/wallet-detalle.component';
import { CriptoListarComponent } from './component/finanzas/cripto-listar/cripto-listar.component';
import { CriptoCrearComponent } from './component/finanzas/cripto-crear/cripto-crear.component';
import { TipoCambioListarComponent } from './component/finanzas/tipo-cambio-listar/tipo-cambio-listar.component';
import { TipoCambioCrearComponent } from './component/finanzas/tipo-cambio-crear/tipo-cambio-crear.component';
import { NotificacionListarComponent } from './component/sistema/notificacion-listar/notificacion-listar.component';
import { Autenticador } from './autenticador/autenticador';
import { seguridadGuard } from './guard/seguridad-guard';
import { roleGuard } from './guard/role.guard';
import { ComercioListarComponent } from './component/comercio/comercio-listar/comercio-listar.component';
import { ComercioCrearComponent } from './component/comercio/comercio-crear/comercio-crear.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PerfilComponent } from './component/usuario/perfil/perfil.component';

export const routes: Routes = [
  // Ruta inicial (Login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login (Público)
  { path: 'login', component: Autenticador },

  // -------------------------------------------------------------------
  // RUTAS PROTEGIDAS (Todo lo de abajo requiere estar logueado)
  // -------------------------------------------------------------------

  // DASHBOARD Y PERFIL (Accesible para todos los usuarios autenticados)
  { path: 'dashboard', component: DashboardComponent, canActivate: [seguridadGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [seguridadGuard] },

  // USUARIOS (Solo Administradores)
  {
    path: 'usuarios',
    component: UsuarioListarComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },
  {
    path: 'usuarios/nuevo',
    component: UsuarioCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },
  {
    path: 'usuarios/editar/:id',
    component: UsuarioCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },

  // TRANSACCIONES (Todos los usuarios autenticados)
  { path: 'transacciones', component: TransaccionListarComponent, canActivate: [seguridadGuard] },
  { path: 'transacciones/nueva', component: TransaccionCrearComponent, canActivate: [seguridadGuard] },

  // PLANES DE PAGO (Todos los usuarios autenticados)
  { path: 'planes', component: PlanPagoListarComponent, canActivate: [seguridadGuard] },
  { path: 'planes/nuevo', component: PlanPagoCrearComponent, canActivate: [seguridadGuard] },

  // MÉTODOS DE PAGO (Todos los usuarios autenticados)
  { path: 'metodos-pago', component: MetodoPagoListarComponent, canActivate: [seguridadGuard] },
  { path: 'metodos-pago/nuevo', component: MetodoPagoCrearComponent, canActivate: [seguridadGuard] },
  { path: 'metodos-pago/editar/:id', component: MetodoPagoCrearComponent, canActivate: [seguridadGuard] },

  // WALLETS (BILLETERAS) (Todos los usuarios autenticados)
  { path: 'wallets', component: WalletListarComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/nueva', component: WalletCrearComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/detalle/:id', component: WalletDetalleComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/editar/:id', component: WalletCrearComponent, canActivate: [seguridadGuard] },

  // CRIPTOMONEDAS (Todos los usuarios autenticados)
  { path: 'criptomonedas', component: CriptoListarComponent, canActivate: [seguridadGuard] },
  { path: 'criptomonedas/nueva', component: CriptoCrearComponent, canActivate: [seguridadGuard] },
  { path: 'criptomonedas/editar/:id', component: CriptoCrearComponent, canActivate: [seguridadGuard] },

  // TIPOS DE CAMBIO (Todos los usuarios autenticados)
  { path: 'tipos-cambio', component: TipoCambioListarComponent, canActivate: [seguridadGuard] },
  { path: 'tipos-cambio/nuevo', component: TipoCambioCrearComponent, canActivate: [seguridadGuard] },

  // NOTIFICACIONES (Todos los usuarios autenticados)
  { path: 'notificaciones', component: NotificacionListarComponent, canActivate: [seguridadGuard] },

  // COMERCIOS (Todos los usuarios autenticados)
  { path: 'comercios', component: ComercioListarComponent, canActivate: [seguridadGuard] },
  { path: 'comercios/nuevo', component: ComercioCrearComponent, canActivate: [seguridadGuard] },
  { path: 'comercios/editar/:id', component: ComercioCrearComponent, canActivate: [seguridadGuard] },

  // Ruta 404 - Redirigir al dashboard si está logueado, sino al login
  { path: '**', redirectTo: 'login' }
];

