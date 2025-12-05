import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoingeckoService } from '../../../service/coingecko.service';
import { CryptoPriceData } from '../../../model/CoinGeckoPriceResponse';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente para mostrar precios de criptomonedas en tiempo real
 * Actualización automática desde CoinGecko API
 */
@Component({
    selector: 'app-crypto-prices',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './crypto-prices.component.html',
    styleUrls: ['./crypto-prices.component.css']
})
export class CryptoPricesComponent implements OnInit, OnDestroy {
    cryptoPrices: CryptoPriceData[] = [];
    isLoading = false;
    errorMessage: string | null = null;
    lastUpdate: Date | null = null;

    private destroy$ = new Subject<void>();

    constructor(private coinGeckoService: CoingeckoService) { }

    ngOnInit(): void {
        this.cargarPrecios();
        this.suscribirActualizacionesAutomaticas();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Carga los precios de criptomonedas
     */
    cargarPrecios(): void {
        this.coinGeckoService.refrescarPrecios()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (prices) => {
                    this.cryptoPrices = prices;
                    this.lastUpdate = new Date();
                    this.errorMessage = null;
                },
                error: (error) => {
                    this.errorMessage = 'Error al cargar precios de criptomonedas';
                    console.error('Error:', error);
                }
            });
    }

    /**
     * Se suscribe a las actualizaciones automáticas
     */
    suscribirActualizacionesAutomaticas(): void {
        this.coinGeckoService.loading$
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => this.isLoading = loading);

        this.coinGeckoService.obtenerPreciosMultiples()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (prices) => {
                    this.cryptoPrices = prices;
                    this.lastUpdate = new Date();
                    this.errorMessage = null;
                },
                error: (error) => {
                    this.errorMessage = 'Error en actualización automática';
                    console.error('Error:', error);
                }
            });
    }

    /**
     * Determina si el cambio es positivo
     */
    isPositiveChange(change: number): boolean {
        return change > 0;
    }

    /**
     * Formatea el cambio con signo
     */
    formatChange(change: number): string {
        const sign = change > 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
    }

    /**
     * Formatea el precio en USD
     */
    formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(price);
    }

    /**
     * Actualización manual
     */
    refrescar(): void {
        this.cargarPrecios();
    }
}
