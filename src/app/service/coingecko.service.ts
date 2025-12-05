import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, shareReplay, switchMap, catchError, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { CoinGeckoPriceResponse, CryptoPriceData, CRYPTO_INFO } from '../model/CoinGeckoPriceResponse';

/**
 * Servicio para integración con CoinGecko API
 * Proporciona precios de criptomonedas en tiempo real con actualización automática
 */
@Injectable({
    providedIn: 'root'
})
export class CoingeckoService {
    private readonly apiUrl = environment.coinGeckoApiUrl;
    private readonly updateInterval = environment.cryptoPriceUpdateInterval;

    // Lista de criptomonedas principales a monitorear
    private readonly cryptoIds = [
        'bitcoin',
        'ethereum',
        'tether',
        'binancecoin',
        'ripple',
        'cardano',
        'solana',
        'polkadot'
    ];

    // Cache compartido de precios con actualización automática
    private priceCache$: Observable<CryptoPriceData[]>;

    // Subject para controlar el estado de carga
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private http: HttpClient) {
        // Inicializar cache con actualización automática
        this.priceCache$ = this.createAutoUpdateStream();
    }

    /**
     * Crea un stream que se actualiza automáticamente cada X segundos
     */
    private createAutoUpdateStream(): Observable<CryptoPriceData[]> {
        return interval(this.updateInterval).pipe(
            switchMap(() => this.fetchPricesFromApi()),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    /**
     * Obtiene precios de múltiples criptomonedas con actualización automática
     */
    public obtenerPreciosMultiples(): Observable<CryptoPriceData[]> {
        return this.priceCache$;
    }

    /**
     * Obtiene el precio de una sola criptomoneda
     */
    public obtenerPrecioCripto(cryptoId: string, monedaFiat: string = 'usd'): Observable<number> {
        const url = `${this.apiUrl}/simple/price?ids=${cryptoId}&vs_currencies=${monedaFiat}&include_24hr_change=true`;

        return this.http.get<CoinGeckoPriceResponse>(url).pipe(
            map(response => {
                const cryptoData = response[cryptoId];
                if (cryptoData && cryptoData.usd !== undefined) {
                    return cryptoData.usd;
                }
                return 0;
            }),
            catchError(error => {
                console.error('Error al obtener precio de CoinGecko:', error);
                return of(0);
            })
        );
    }

    /**
     * Obtiene precios directamente de la API (sin cache)
     */
    private fetchPricesFromApi(): Observable<CryptoPriceData[]> {
        this.loadingSubject.next(true);

        const ids = this.cryptoIds.join(',');
        const url = `${this.apiUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

        return this.http.get<CoinGeckoPriceResponse>(url).pipe(
            map(response => this.transformResponseToArray(response)),
            catchError(error => {
                console.error('Error al obtener precios de CoinGecko:', error);
                this.loadingSubject.next(false);
                return of([]);
            }),
            map(data => {
                this.loadingSubject.next(false);
                return data;
            })
        );
    }

    /**
     * Transforma la respuesta de CoinGecko a un array de CryptoPriceData
     */
    private transformResponseToArray(response: CoinGeckoPriceResponse): CryptoPriceData[] {
        const result: CryptoPriceData[] = [];

        for (const cryptoId of this.cryptoIds) {
            if (response[cryptoId]) {
                const info = CRYPTO_INFO[cryptoId];
                result.push({
                    id: cryptoId,
                    symbol: info.symbol,
                    name: info.name,
                    currentPrice: response[cryptoId].usd,
                    change24h: response[cryptoId].usd_24h_change || 0,
                    lastUpdated: new Date()
                });
            }
        }

        return result;
    }

    /**
     * Fuerza una actualización inmediata (sin esperar el intervalo)
     */
    public refrescarPrecios(): Observable<CryptoPriceData[]> {
        return this.fetchPricesFromApi();
    }

    /**
     * Obtiene la lista de criptomonedas disponibles
     */
    public obtenerCriptomonedasDisponibles(): string[] {
        return this.cryptoIds;
    }
}
