import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TransaccionService } from '../../../service/transaccion.service';
import { ComercioService } from '../../../service/comercio.service';
import { CriptomonedaService } from '../../../service/criptomoneda.service';
import { MetodoPagoService } from '../../../service/metodo-pago.service';
import { WalletService } from '../../../service/wallet.service';
import { WalletStateService } from '../../../service/wallet-state.service';
import { UsuarioService } from '../../../service/usuario.service';
import { TipoCambioService } from '../../../service/tipo-cambio.service';
import { LoginService } from '../../../service/login-service';
import { NotificacionService } from '../../../service/notificacion.service';
import { Wallet } from '../../../model/Wallet';
import { Notificacion } from '../../../model/Notificacion';

@Component({
  selector: 'app-transaccion-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transaccion-crear.component.html',
  styleUrl: './transaccion-crear.component.css'
})
export class TransaccionCrearComponent implements OnInit {
  form: FormGroup;
  comercios: any[] = [];
  criptos: any[] = [];
  metodos: any[] = [];
  walletsUsuario: Wallet[] = [];

  usuarioIdActual: number | null = null;
  guardando = false;

  // Propiedades requeridas por el HTML
  saldoDisponibleCripto: number = 0;
  nombreCriptoSeleccionada: string = '';
  codigoCriptoSeleccionada: string = '';
  tasaCambioActual: number = 0;
  montoEnCripto: number = 0;
  walletActual: Wallet | null = null;

  // Propiedades P2P
  tipoTransaccion: 'comercio' | 'p2p' = 'comercio';
  emailDestinatario: string = '';
  usuarioDestinatario: any = null;
  walletDestinatario: Wallet | null = null;
  validandoDestinatario: boolean = false;
  errorDestinatario: string = '';

  constructor(
    private fb: FormBuilder,
    private transaccionService: TransaccionService,
    private comercioService: ComercioService,
    private criptoService: CriptomonedaService,
    private metodoPagoService: MetodoPagoService,
    private walletService: WalletService,
    private walletStateService: WalletStateService,
    private usuarioService: UsuarioService,
    private tipoCambioService: TipoCambioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private notificacionService: NotificacionService
  ) {
    this.form = this.fb.group({
      comercioId: ['', Validators.required],
      criptoId: ['', Validators.required],
      metodoPagoId: ['', Validators.required],
      montoTotalFiat: [0, [Validators.required, Validators.min(0.01)]],
      // Campos calculados o por defecto
      codigoMoneda: ['USD'],
      montoTotalCripto: [0],
      tasaAplicada: [1],
      tipoCambioId: [null],
      usuarioId: [this.usuarioIdActual],
      estado: ['COMPLETADA'],
      txHash: ['GENERATED_BY_FRONT']
    });
  }

  ngOnInit(): void {
    // 1. Intentar obtener ID del token directamente
    const idFromToken = this.loginService.getUsuarioId();

    if (idFromToken) {
      this.usuarioIdActual = idFromToken;
      this.inicializarDatosUsuario();
    } else {
      // 2. Fallback: Si no hay ID en token, buscar por email (Más robusto)
      const email = this.loginService.getUsuarioActual();
      if (email) {
        this.usuarioService.obtenerPorEmail(email).subscribe({
          next: (usuario) => {
            if (usuario && usuario.usuarioId) {
              this.usuarioIdActual = usuario.usuarioId;
              this.inicializarDatosUsuario();
            }
          },
          error: (err) => console.error('Error recuperando usuario por email', err)
        });
      }
    }

    // Cargar catálogos
    this.comercioService.obtenerTodos().subscribe(data => this.comercios = data);
    this.criptoService.obtenerActivas().subscribe(data => this.criptos = data);
    this.metodoPagoService.obtenerActivos().subscribe(data => this.metodos = data);

    // Suscribirse a cambios en el formulario para recalcular
    this.form.get('criptoId')?.valueChanges.subscribe(val => this.onCriptoChange(val));
    this.form.get('montoTotalFiat')?.valueChanges.subscribe(() => this.calcularConversion());
  }

  inicializarDatosUsuario() {
    if (this.usuarioIdActual) {
      this.form.patchValue({ usuarioId: this.usuarioIdActual });
      this.cargarWallets();
    }
  }

  cargarWallets() {
    if (!this.usuarioIdActual) return;
    this.walletService.obtenerPorUsuario(this.usuarioIdActual).subscribe({
      next: (data) => {
        this.walletsUsuario = data;
        console.log('DEBUG: Wallets del usuario cargadas:', this.walletsUsuario);

        // Re-validar selección actual si ya existe, por si las wallets cargaron después
        const currentCriptoId = this.form.get('criptoId')?.value;
        if (currentCriptoId) {
          this.onCriptoChange(currentCriptoId);
        }
      },
      error: (err) => console.error('Error cargando wallets', err)
    });
  }

  onCriptoChange(criptoId: number) {
    if (!criptoId) {
      this.resetearInformacionCripto();
      return;
    }

    const idToSearch = Number(criptoId);

    // Buscar la cripto seleccionada
    const cripto = this.criptos.find(c => c.criptoId === idToSearch);
    if (cripto) {
      this.nombreCriptoSeleccionada = cripto.nombre;
      this.codigoCriptoSeleccionada = cripto.codigo;
    }

    // Buscar la wallet correspondiente (Robustez: buscar por ID raíz o anidado)
    this.walletActual = this.walletsUsuario.find(w => w.criptoId === idToSearch || w.criptomoneda?.criptoId === idToSearch) || null;

    if (this.walletActual) {
      this.saldoDisponibleCripto = this.walletActual.saldo;
      this.form.get('criptoId')?.setErrors(null); // Limpiar error si existe
    } else {
      this.saldoDisponibleCripto = 0;
      // Solo mostrar error si ya se cargaron las wallets, para evitar falsos positivos durante la carga
      if (this.walletsUsuario.length > 0) {
        this.snackBar.open('No tienes una billetera para esta criptomoneda', 'Cerrar', { duration: 3000 });
        this.form.get('criptoId')?.setErrors({ noWallet: true });
      }
    }

    // Obtener tasa de cambio
    this.obtenerTasaCambio(criptoId);

    // Validar wallet destinatario si es P2P
    if (this.tipoTransaccion === 'p2p' && this.usuarioDestinatario) {
      this.validarWalletDestinatario();
    }
  }

  obtenerTasaCambio(criptoId: number) {
    const cripto = this.criptos.find(c => c.criptoId === criptoId);
    if (!cripto) return;

    this.tipoCambioService.obtenerTasaMasReciente(cripto.codigo, 'USD').subscribe({
      next: (tasa) => {
        if (tasa) {
          this.tasaCambioActual = tasa.tasa;
          this.form.patchValue({
            tasaAplicada: this.tasaCambioActual,
            tipoCambioId: tasa.tipoCambioId
          });
          this.calcularConversion();
        }
      },
      error: (err) => console.error('Error obteniendo tasa', err)
    });
  }

  calcularConversion() {
    const montoFiat = this.form.get('montoTotalFiat')?.value || 0;

    if (this.tasaCambioActual > 0) {
      this.montoEnCripto = montoFiat / this.tasaCambioActual;
      this.form.patchValue({ montoTotalCripto: this.montoEnCripto }, { emitEvent: false });
    } else {
      this.montoEnCripto = 0;
    }

    this.validarSaldoSuficiente();
  }

  validarSaldoSuficiente() {
    const montoControl = this.form.get('montoTotalFiat');
    if (!montoControl) return;

    if (this.walletActual && this.montoEnCripto > this.saldoDisponibleCripto) {
      montoControl.setErrors({ ...montoControl.errors, saldoInsuficiente: true });
    } else {
      if (montoControl.errors) {
        const { saldoInsuficiente, ...otrosErrores } = montoControl.errors;
        montoControl.setErrors(Object.keys(otrosErrores).length ? otrosErrores : null);
      }
    }
  }

  resetearInformacionCripto() {
    this.walletActual = null;
    this.saldoDisponibleCripto = 0;
    this.nombreCriptoSeleccionada = '';
    this.codigoCriptoSeleccionada = '';
    this.tasaCambioActual = 0;
    this.montoEnCripto = 0;
  }

  get tieneSaldoInsuficiente(): boolean {
    return this.form.get('montoTotalFiat')?.hasError('saldoInsuficiente') || false;
  }

  get montoMaximoUSD(): number {
    return this.saldoDisponibleCripto * this.tasaCambioActual;
  }

  // ==========================================
  // MÉTODOS P2P
  // ==========================================

  onTipoTransaccionChange(tipo: 'comercio' | 'p2p') {
    this.tipoTransaccion = tipo;

    if (tipo === 'comercio') {
      this.form.get('comercioId')?.setValidators([Validators.required]);
      this.form.get('comercioId')?.enable();
      this.emailDestinatario = '';
      this.usuarioDestinatario = null;
      this.walletDestinatario = null;
      this.errorDestinatario = '';
    } else {
      this.form.get('comercioId')?.clearValidators();
      this.form.get('comercioId')?.disable();
    }
    this.form.get('comercioId')?.updateValueAndValidity();
  }

  validarDestinatarioP2P(event: any) {
    const email = event.target.value.trim();
    if (!email || !this.isValidEmail(email)) {
      this.errorDestinatario = '';
      this.usuarioDestinatario = null;
      return;
    }

    const emailActual = this.loginService.getUsuarioActual();
    if (email === emailActual) {
      this.errorDestinatario = 'No puedes transferirte a ti mismo';
      return;
    }

    this.validandoDestinatario = true;
    this.usuarioService.obtenerPorEmail(email).subscribe({
      next: (usuario) => {
        this.usuarioDestinatario = usuario;
        this.validandoDestinatario = false;
        this.errorDestinatario = '';
        if (this.codigoCriptoSeleccionada) this.validarWalletDestinatario();
      },
      error: () => {
        this.errorDestinatario = 'Usuario no encontrado';
        this.usuarioDestinatario = null;
        this.validandoDestinatario = false;
      }
    });
  }

  validarWalletDestinatario() {
    if (!this.usuarioDestinatario || !this.codigoCriptoSeleccionada) return;

    // Lógica robusta: Buscar por SÍMBOLO de moneda, no por ID
    this.walletService.obtenerPorUsuario(this.usuarioDestinatario.usuarioId).subscribe({
      next: (wallets) => {
        // MATCH LOGIC: Comparar por ID de criptomoneda (Más seguro que por código anidado)
        // Primero obtenemos el ID de la moneda seleccionada
        const targetCripto = this.criptos.find(c => c.codigo === this.codigoCriptoSeleccionada);
        const targetId = targetCripto ? targetCripto.criptoId : null;

        const walletCompatible = wallets.find(w =>
          (targetId && w.criptoId === targetId) ||
          (w.criptomoneda?.codigo === this.codigoCriptoSeleccionada)
        );

        if (walletCompatible) {
          this.walletDestinatario = walletCompatible;
          this.errorDestinatario = '';
          console.log('Wallet destinatario encontrada:', walletCompatible);
        } else {
          this.errorDestinatario = `El destinatario no tiene una wallet de ${this.codigoCriptoSeleccionada}`;
          this.walletDestinatario = null;
        }
      },
      error: () => {
        this.errorDestinatario = 'Error validando wallet destinatario';
      }
    });
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  guardar() {
    if (this.form.invalid) {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.tieneSaldoInsuficiente) {
      this.snackBar.open('Saldo insuficiente', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.tipoTransaccion === 'p2p') {
      if (!this.walletDestinatario) {
        this.snackBar.open(this.errorDestinatario || 'Destinatario inválido', 'Cerrar', { duration: 3000 });
        return;
      }
      this.procesarTransferenciaP2P();
    } else {
      this.procesarPagoComercio();
    }
  }

  procesarTransferenciaP2P() {
    // 1. Validaciones Básicas
    if (this.form.invalid) {
      this.snackBar.open('Complete todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    // 2. Recuperar Wallet Remitente (Usuario Actual)
    const criptoId = this.form.get('criptoId')?.value;

    // Asegurar que tenemos el ID del usuario
    const usuarioId = this.usuarioIdActual || this.loginService.getUsuarioId();
    if (!usuarioId) {
      this.snackBar.open('Error: No se pudo identificar al usuario. Inicie sesión nuevamente.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Función auxiliar para ejecutar la transacción una vez se tiene la wallet
    const ejecutarTransferencia = (walletRemitente: Wallet) => {
      if (!walletRemitente || !walletRemitente.walletId) {
        console.error('Error: Wallet remitente inválida.', walletRemitente);
        this.snackBar.open('Error: Billetera inválida.', 'Cerrar', { duration: 3000 });
        return;
      }

      // 3. Validar Wallet Destinatario
      if (!this.walletDestinatario || !this.walletDestinatario.walletId) {
        this.snackBar.open('Error: Destinatario no válido.', 'Cerrar', { duration: 3000 });
        return;
      }

      // 4. Validar Auto-Transferencia
      if (walletRemitente.walletId === this.walletDestinatario.walletId) {
        this.snackBar.open('No puedes transferirte a ti mismo.', 'Cerrar', { duration: 3000 });
        return;
      }

      // 5. Ejecutar Transacción
      this.guardando = true;
      const remitenteId = walletRemitente.walletId;
      const destinatarioId = this.walletDestinatario.walletId;
      const monto = Number(this.montoEnCripto);

      // Paso A: Descontar del Remitente
      const nuevoSaldoRemitente = Number(walletRemitente.saldo) - monto;

      // Clonamos el objeto y actualizamos el saldo
      const walletRemitenteActualizada = { ...walletRemitente, saldo: nuevoSaldoRemitente };

      // Usamos ACTUALIZAR (PUT) en lugar de PATCH para evitar problemas de permisos específicos
      this.walletService.actualizar(remitenteId, walletRemitenteActualizada).subscribe({
        next: () => {
          // Actualizar UI localmente
          this.walletActual = walletRemitenteActualizada;
          this.actualizarSaldoLocal(nuevoSaldoRemitente);

          // Paso B: Crear Notificación para el Remitente (Usuario Actual)
          const notificacionRemitente: Notificacion = {
            usuarioId: usuarioId,
            titulo: 'Transferencia Enviada',
            mensaje: `Has enviado ${monto} ${this.codigoCriptoSeleccionada} a ${this.emailDestinatario}`,
            leido: false,
            fechaEnvio: new Date().toISOString()
          };

          this.notificacionService.crear(notificacionRemitente).subscribe({
            next: () => console.log('Notificación enviada al remitente'),
            error: (err) => console.error('Error enviando notificación al remitente', err)
          });

          // Paso C: Acreditar al Destinatario
          const nuevoSaldoDestinatario = Number(this.walletDestinatario!.saldo) + monto;
          const walletDestinatarioActualizada = { ...this.walletDestinatario!, saldo: nuevoSaldoDestinatario };

          this.walletService.actualizar(destinatarioId, walletDestinatarioActualizada).subscribe({
            next: () => {
              // Paso D: Crear Notificación para el Destinatario
              const notificacionDestinatario: Notificacion = {
                usuarioId: this.usuarioDestinatario.usuarioId,
                titulo: 'Transferencia Recibida',
                mensaje: `Has recibido ${monto} ${this.codigoCriptoSeleccionada} de ${this.loginService.getUsuarioActual()}`,
                leido: false,
                fechaEnvio: new Date().toISOString()
              };

              this.notificacionService.crear(notificacionDestinatario).subscribe({
                next: () => console.log('Notificación enviada al destinatario'),
                error: (err) => console.error('Error enviando notificación al destinatario', err)
              });

              // Paso E: Guardar Historial
              this.crearRegistroTransaccion();
            },
            error: (err) => {
              console.error('Error acreditando al destinatario', err);
              this.guardando = false;
              this.snackBar.open('Error crítico: Fondos descontados pero no acreditados.', 'Cerrar', { duration: 5000 });
            }
          });
        },
        error: (err) => {
          console.error('Error debitando al remitente', err);
          this.guardando = false;
          this.snackBar.open('Error al procesar el pago.', 'Cerrar', { duration: 3000 });
        }
      });
    };

    // Intentar buscar en el array de wallets cargadas
    let walletRemitente = this.walletsUsuario.find(w =>
      w.criptoId == criptoId ||
      w.criptomoneda?.criptoId == criptoId
    );

    // Si no se encuentra, intentar usar la wallet seleccionada en la UI si coincide
    if (!walletRemitente && this.walletActual && (this.walletActual.criptoId == criptoId || this.walletActual.criptomoneda?.criptoId == criptoId)) {
      walletRemitente = this.walletActual;
    }

    if (walletRemitente) {
      // Si la encontramos localmente, procedemos
      ejecutarTransferencia(walletRemitente);
    } else {
      // FALLBACK: Si no se encuentra (ej. walletsUsuario vacío), intentamos cargar del backend
      console.warn('Wallet no encontrada localmente. Intentando recuperar del servidor...');
      this.guardando = true; // Mostrar spinner

      this.walletService.obtenerPorUsuario(usuarioId).subscribe({
        next: (wallets) => {
          this.walletsUsuario = wallets; // Actualizar caché local
          console.log('Wallets recuperadas:', wallets);

          // Buscar nuevamente
          walletRemitente = this.walletsUsuario.find(w =>
            w.criptoId == criptoId ||
            w.criptomoneda?.criptoId == criptoId
          );

          if (walletRemitente) {
            this.guardando = false; // Ocultar spinner temporalmente (se activará en ejecutar)
            ejecutarTransferencia(walletRemitente);
          } else {
            this.guardando = false;
            console.error('Error: Wallet remitente no encontrada tras recarga. CriptoID:', criptoId);
            this.snackBar.open('Error: No se encontró tu billetera para esta moneda.', 'Cerrar', { duration: 3000 });
          }
        },
        error: (err) => {
          this.guardando = false;
          console.error('Error recuperando wallets:', err);
          this.snackBar.open('Error al validar información de billetera.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  procesarPagoComercio() {
    if (!this.walletActual?.walletId) return;

    this.guardando = true;
    const nuevoSaldo = this.saldoDisponibleCripto - this.montoEnCripto;

    // Clonamos el objeto y actualizamos el saldo
    const walletActualizada = { ...this.walletActual, saldo: nuevoSaldo };

    // Usamos ACTUALIZAR (PUT)
    this.walletService.actualizar(this.walletActual.walletId, walletActualizada).subscribe({
      next: () => {
        this.actualizarSaldoLocal(nuevoSaldo);
        this.crearRegistroTransaccion();
      },
      error: (err) => {
        this.guardando = false;
        console.error(err);
        this.snackBar.open('Error al procesar el pago.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  crearRegistroTransaccion() {
    const transaccionData = {
      ...this.form.value,
      montoTotalCripto: this.montoEnCripto,
      tasaAplicada: this.tasaCambioActual,
      comercioId: this.tipoTransaccion === 'comercio' ? this.form.get('comercioId')?.value : (this.comercios[0]?.comercioId || 1),
      txHash: this.tipoTransaccion === 'p2p' ? `P2P-${Date.now()}` : 'GENERATED_BY_FRONT'
    };

    this.transaccionService.crear(transaccionData).subscribe({
      next: () => {
        this.snackBar.open('Transacción exitosa', 'Cerrar', { duration: 3000 });
        this.guardando = false;
        setTimeout(() => this.router.navigate(['/transacciones']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.snackBar.open('Error al guardar transacción', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  actualizarSaldoLocal(nuevoSaldo: number) {
    if (!this.walletActual || !this.walletActual.walletId) return;

    // Actualizar state
    this.walletStateService.actualizarSaldo(
      this.walletActual.walletId,
      nuevoSaldo,
      this.codigoCriptoSeleccionada
    );

    // Actualizar variable local
    this.saldoDisponibleCripto = nuevoSaldo;
    if (this.walletActual) {
      this.walletActual.saldo = nuevoSaldo;
    }
  }
}
