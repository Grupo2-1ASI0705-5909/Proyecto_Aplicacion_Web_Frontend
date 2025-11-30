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
import { CriptoTasasLiveComponent } from './component/finanzas/cripto-tasas-live/cripto-tasas-live.component';
import { NotificacionListarComponent } from './component/sistema/notificacion-listar/notificacion-listar.component';
<<<<<<< HEAD
import { Autenticador } from './autenticador/autenticador';
import { RegistroComponent } from './autenticador/registro/registro.component';
import { RecuperarPasswordComponent } from './autenticador/recuperar-password/recuperar-password.component';
import { seguridadGuard } from './guard/seguridad-guard';
import { roleGuard } from './guard/role.guard';
import { ComercioListarComponent } from './component/comercio/comercio-listar/comercio-listar.component';
import { ComercioCrearComponent } from './component/comercio/comercio-crear/comercio-crear.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PerfilComponent } from './component/usuario/perfil/perfil.component';
import { HomeComponent } from './component/landing/home/home.component';
import { NoticiasComponent } from './component/landing/noticias/noticias.component';
import { ComunidadComponent } from './component/landing/comunidad/comunidad.component';
import { RecomendacionesComponent } from './component/landing/recomendaciones/recomendaciones.component';
import { ExpansionComponent } from './component/landing/expansion/expansion.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'noticias', component: NoticiasComponent }, // index_2.html
  { path: 'comunidad', component: ComunidadComponent },
  { path: 'recomendaciones', component: RecomendacionesComponent },
  { path: 'cobertura', component: ExpansionComponent },

  // Ruta inicial (Login)
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login (Público)
  { path: 'login', component: Autenticador },


  // Registro (Público)
  { path: 'registro', component: RegistroComponent },

  // Recuperar Contraseña (Público)
  { path: 'recuperar-password', component: RecuperarPasswordComponent },

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

  // MÉTODOS DE PAGO (Admin y Cliente - Comercios usan los de sus clientes)
  {
    path: 'metodos-pago',
    component: MetodoPagoListarComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR', 'CLIENTE', 'USER', 'USUARIO'] }
  },
  {
    path: 'metodos-pago/nuevo',
    component: MetodoPagoCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR', 'CLIENTE', 'USER', 'USUARIO'] }
  },
  {
    path: 'metodos-pago/editar/:id',
    component: MetodoPagoCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR', 'CLIENTE', 'USER', 'USUARIO'] }
  },

  // WALLETS (BILLETERAS) (Todos los usuarios autenticados)
  { path: 'wallets', component: WalletListarComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/nueva', component: WalletCrearComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/detalle/:id', component: WalletDetalleComponent, canActivate: [seguridadGuard] },
  { path: 'wallets/editar/:id', component: WalletCrearComponent, canActivate: [seguridadGuard] },

  // CRIPTOMONEDAS (Listar: todos, Crear/Editar: solo Admin)
  { path: 'criptomonedas', component: CriptoListarComponent, canActivate: [seguridadGuard] },
  {
    path: 'criptomonedas/nueva',
    component: CriptoCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },
  {
    path: 'criptomonedas/editar/:id',
    component: CriptoCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },

  // TIPOS DE CAMBIO (Listar: todos, Crear: solo Admin)
  { path: 'tipos-cambio', component: TipoCambioListarComponent, canActivate: [seguridadGuard] },
  {
    path: 'tipos-cambio/nuevo',
    component: TipoCambioCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },

  // TASAS EN TIEMPO REAL (Todos los usuarios autenticados)
  { path: 'cripto-tasas-live', component: CriptoTasasLiveComponent, canActivate: [seguridadGuard] },

  // NOTIFICACIONES (Todos los usuarios autenticados)
  { path: 'notificaciones', component: NotificacionListarComponent, canActivate: [seguridadGuard] },

  // COMERCIOS (Listar todos: solo Admin, Crear/Editar: Admin y Comercio)
  {
    path: 'comercios',
    component: ComercioListarComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR'] }
  },
  {
    path: 'comercios/nuevo',
    component: ComercioCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR', 'COMERCIO', 'VENDEDOR'] }
  },
  {
    path: 'comercios/editar/:id',
    component: ComercioCrearComponent,
    canActivate: [seguridadGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRADOR', 'COMERCIO', 'VENDEDOR'] }
  },

  // Ruta 404 - Redirigir al dashboard si está logueado, sino al login
  { path: '**', redirectTo: 'login' }
=======
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
>>>>>>> 3330925f60b519963fce1d47832c4bf37df971c8
];
