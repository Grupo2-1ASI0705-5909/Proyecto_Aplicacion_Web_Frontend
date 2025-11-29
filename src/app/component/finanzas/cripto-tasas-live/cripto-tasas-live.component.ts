import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TipoCambioService } from '../../../service/tipo-cambio.service';
import { TipoCambio } from '../../../model/TipoCambio';
import { Subscription } from 'rxjs';

interface TasaConTendencia extends TipoCambio {
    tendencia?: 'up' | 'down' | 'neutral';
    cambioAnterior?: number;
}

@Component({
    selector: 'app-cripto-tasas-live',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './cripto-tasas-live.component.html',
    styleUrl: './cripto-tasas-live.component.css'
})
export class CriptoTasasLiveComponent implements OnInit, OnDestroy {
    tasas: TasaConTendencia[] = [];
    cargando = true;
    ultimaActualizacion: Date = new Date();
    private subscription?: Subscription;
    private tasasAnteriores = new Map<string, number>();

    constructor(private tipoCambioService: TipoCambioService) { }

    ngOnInit(): void {
        // Suscribirse al observable de tasas en tiempo real
        this.subscription = this.tipoCambioService.tasasEnTiempoReal$.subscribe({
            next: (data) => {
                this.procesarTasas(data);
                this.cargando = false;
                this.ultimaActualizacion = new Date();
            },
            error: (err) => {
                console.error('Error al cargar tasas:', err);
                this.cargando = false;
            }
        });
    }

    ngOnDestroy(): void {
        // Limpiar suscripción para evitar memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private procesarTasas(nuevasTasas: TipoCambio[]): void {
        this.tasas = nuevasTasas.map(tasa => {
            const key = `${tasa.desdeCodigo}-${tasa.hastaCodigo}`;
            const tasaAnterior = this.tasasAnteriores.get(key);

            let tendencia: 'up' | 'down' | 'neutral' = 'neutral';

            if (tasaAnterior !== undefined) {
                if (tasa.tasa > tasaAnterior) {
                    tendencia = 'up';
                } else if (tasa.tasa < tasaAnterior) {
                    tendencia = 'down';
                }
            }

            // Guardar tasa actual para la próxima comparación
            this.tasasAnteriores.set(key, tasa.tasa);

            return {
                ...tasa,
                tendencia,
                cambioAnterior: tasaAnterior
            };
        });
    }

    obtenerIconoCripto(codigo: string): string {
        const iconos: { [key: string]: string } = {
            'BTC': '₿',
            'ETH': 'Ξ',
            'USDT': '₮',
            'BNB': 'Ⓑ',
            'SOL': '◎',
            'ADA': '₳',
            'XRP': 'Ʀ',
            'DOT': '●',
            'DOGE': 'Ð',
            'MATIC': 'Ⓜ'
        };
        return iconos[codigo] || '₿';
    }

    obtenerColorCripto(codigo: string): string {
        const colores: { [key: string]: string } = {
            'BTC': '#F7931A',
            'ETH': '#627EEA',
            'USDT': '#26A17B',
            'BNB': '#F3BA2F',
            'SOL': '#14F195',
            'ADA': '#0033AD',
            'XRP': '#23292F',
            'DOT': '#E6007A',
            'DOGE': '#C2A633',
            'MATIC': '#8247E5'
        };
        return colores[codigo] || '#6366f1';
    }

    calcularCambioPorcentaje(tasa: TasaConTendencia): number {
        if (!tasa.cambioAnterior || tasa.cambioAnterior === 0) {
            return 0;
        }
        return ((tasa.tasa - tasa.cambioAnterior) / tasa.cambioAnterior) * 100;
    }
}
