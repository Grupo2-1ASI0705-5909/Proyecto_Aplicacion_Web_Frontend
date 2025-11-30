import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wallet } from '../model/Wallet';

/**
 * Servicio de gestión de estado compartido para Wallets
 * Permite que múltiples componentes se mantengan sincronizados
 * cuando hay cambios en los saldos
 */
@Injectable({
    providedIn: 'root'
})
export class WalletStateService {
    // BehaviorSubject que mantiene el estado actual de las wallets
    private walletsSubject = new BehaviorSubject<Wallet[]>([]);

    // Observable público para que los componentes se suscriban
    public wallets$ = this.walletsSubject.asObservable();

    // Señal para forzar recarga desde el backend
    private reloadTrigger = new BehaviorSubject<boolean>(false);
    public reload$ = this.reloadTrigger.asObservable();

    constructor() {
        console.log('[INIT] WalletStateService inicializado');
    }

    /**
     * Establece las wallets iniciales (llamado cuando se cargan del backend)
     */
    setWallets(wallets: Wallet[]) {
        console.log('[STATE] Estableciendo wallets en el estado:', wallets);
        this.walletsSubject.next(wallets);
    }

    /**
     * Obtiene el estado actual de las wallets
     */
    getWallets(): Wallet[] {
        return this.walletsSubject.value;
    }

    /**
     * Actualiza el saldo de una wallet específica
     * @param walletId ID de la wallet a actualizar
     * @param nuevoSaldo Nuevo saldo
     * @param codigoCripto Código de la criptomoneda (para logs)
     */
    actualizarSaldo(walletId: number, nuevoSaldo: number, codigoCripto: string = '') {
        const wallets = this.getWallets();
        const walletIndex = wallets.findIndex(w => w.walletId === walletId);

        if (walletIndex !== -1) {
            const saldoAnterior = wallets[walletIndex].saldo;

            console.log(`[UPDATE] Actualizando saldo en State Service:`);
            console.log(`   Wallet ID: ${walletId}`);
            console.log(`   Cripto: ${codigoCripto}`);
            console.log(`   Saldo anterior: ${saldoAnterior}`);
            console.log(`   Nuevo saldo: ${nuevoSaldo}`);
            console.log(`   Diferencia: ${nuevoSaldo - saldoAnterior}`);

            // Crear nuevo array (inmutabilidad)
            const walletsActualizadas = [...wallets];
            walletsActualizadas[walletIndex] = {
                ...walletsActualizadas[walletIndex],
                saldo: nuevoSaldo
            };

            // Emitir el nuevo estado
            this.walletsSubject.next(walletsActualizadas);

            console.log('[SUCCESS] Estado actualizado - Todos los componentes suscritos serán notificados');
        } else {
            console.warn(`[WARNING] No se encontró wallet con ID ${walletId} en el estado`);
        }
    }

    /**
     * Descontar un monto del saldo de una wallet
     * @param walletId ID de la wallet
     * @param montoADescontar Monto a descontar (en cripto)
     * @param codigoCripto Código de la criptomoneda
     */
    descontarSaldo(walletId: number, montoADescontar: number, codigoCripto: string = '') {
        const wallets = this.getWallets();
        const wallet = wallets.find(w => w.walletId === walletId);

        if (wallet) {
            const nuevoSaldo = wallet.saldo - montoADescontar;

            if (nuevoSaldo < 0) {
                console.error(`[ERROR] El saldo resultante sería negativo!`);
                console.error(`   Saldo actual: ${wallet.saldo}`);
                console.error(`   Monto a descontar: ${montoADescontar}`);
                return false;
            }

            this.actualizarSaldo(walletId, nuevoSaldo, codigoCripto);
            return true;
        }

        return false;
    }

    /**
     * Fuerza una recarga de las wallets desde el backend
     * Emite una señal para que los componentes vuelvan a cargar
     */
    triggerReload() {
        console.log('[RELOAD] Triggering reload de wallets desde backend');
        this.reloadTrigger.next(true);
    }

    /**
     * Limpia el estado (útil al cerrar sesión)
     */
    clear() {
        console.log('[CLEANUP] Limpiando estado de wallets');
        this.walletsSubject.next([]);
    }
}
