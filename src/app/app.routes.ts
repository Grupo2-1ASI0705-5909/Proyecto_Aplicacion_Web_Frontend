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
import { CriptoListarComponent } from './component/finanzas/cripto-listar/cripto-listar.component';
import { CriptoCrearComponent } from './component/finanzas/cripto-crear/cripto-crear.component';
import { TipoCambioListarComponent } from './component/finanzas/tipo-cambio-listar/tipo-cambio-listar.component';
import { TipoCambioCrearComponent } from './component/finanzas/tipo-cambio-crear/tipo-cambio-crear.component';
import { NotificacionListarComponent } from './component/sistema/notificacion-listar/notificacion-listar.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent} from './component/dashboard/dashboard.component';
import { ComercioListarComponent } from './component/comercio/comercio-listar/comercio-listar.component';
import { ComercioCrearComponent } from './component/comercio/comercio-crear/comercio-crear.component';
import { PerfilComponent } from './component/usuario/perfil/perfil.component';

export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil', component: PerfilComponent },

  { path: 'usuarios', component: UsuarioListarComponent },
  { path: 'usuarios/nuevo', component: UsuarioCrearComponent },
  { path: 'usuarios/editar/:id', component: UsuarioCrearComponent },

  { path: 'transacciones', component: TransaccionListarComponent },
  { path: 'transacciones/nueva', component: TransaccionCrearComponent },

  { path: 'planes', component: PlanPagoListarComponent },
  { path: 'planes/nuevo', component: PlanPagoCrearComponent },

  { path: 'metodos-pago', component: MetodoPagoListarComponent },
  { path: 'metodos-pago/nuevo', component: MetodoPagoCrearComponent },
  { path: 'metodos-pago/editar/:id', component: MetodoPagoCrearComponent },

  // Rutas de Comercios agregadas
  { path: 'comercios', component: ComercioListarComponent },
  { path: 'comercios/nuevo', component: ComercioCrearComponent },
  { path: 'comercios/editar/:id', component: ComercioCrearComponent },

  { path: 'wallets', component: WalletListarComponent },
  { path: 'wallets/nueva', component: WalletCrearComponent },
  { path: 'wallets/editar/:id', component: WalletCrearComponent },

  { path: 'criptomonedas', component: CriptoListarComponent },
  { path: 'criptomonedas/nueva', component: CriptoCrearComponent },
  { path: 'criptomonedas/editar/:id', component: CriptoCrearComponent },

  { path: 'tipos-cambio', component: TipoCambioListarComponent },
  { path: 'tipos-cambio/nuevo', component: TipoCambioCrearComponent },

  { path: 'notificaciones', component: NotificacionListarComponent },
];
