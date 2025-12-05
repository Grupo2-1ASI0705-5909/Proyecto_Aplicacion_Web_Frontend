import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { AdviceResponse, AdviceSearchResponse, Advice } from '../model/AdviceResponse';

/**
 * Servicio para integración con Advice Slip API
 * Busca consejos financieros usando palabras clave específicas
 */
@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private readonly apiUrl = environment.adviceSlipApiUrl;

    /**
     * Lista de palabras clave financieras para buscar consejos relevantes
     * La API de Advice Slip está en inglés, por eso usamos keywords en inglés
     */
    private readonly financialKeywords: string[] = [
        // Dinero y finanzas
        'money',
        'finance',
        'financial',
        'cash',
        'wealth',
        'rich',
        'fortune',

        // Inversión
        'invest',
        'investment',
        'investor',
        'portfolio',
        'stock',
        'asset',

        // Ahorro y presupuesto
        'save',
        'saving',
        'savings',
        'budget',
        'frugal',
        'thrift',

        // Deuda y crédito
        'debt',
        'credit',
        'loan',
        'borrow',

        // Gastos e ingresos
        'spend',
        'spending',
        'expense',
        'income',
        'salary',
        'wage',
        'earn',
        'earnings',

        // Negocios y emprendimiento
        'business',
        'entrepreneur',
        'company',
        'profit',
        'loss',
        'revenue',

        // Banca y economía
        'bank',
        'banking',
        'economy',
        'economic',
        'tax',
        'pension',
        'retirement',

        // Carrera y trabajo
        'career',
        'job',
        'work',
        'professional'
    ];

    constructor(private http: HttpClient) { }

    /**
     * Obtiene un consejo financiero buscando con palabras clave aleatorias
     * Intenta hasta 3 palabras clave diferentes si no encuentra resultados
     */
    public obtenerConsejoFinanciero(): Observable<Advice> {
        // Seleccionar una palabra clave aleatoria
        const randomKeyword = this.getRandomKeyword();

        return this.buscarConsejo(randomKeyword).pipe(
            map(consejos => {
                if (consejos && consejos.length > 0) {
                    // Retornar un consejo aleatorio de los resultados
                    const randomIndex = Math.floor(Math.random() * consejos.length);
                    return consejos[randomIndex];
                }
                // Si no hay resultados, lanzar error para reintentar
                throw new Error('No se encontraron consejos con esta palabra clave');
            }),
            catchError((error) => {
                // Intentar con una segunda palabra clave
                const secondKeyword = this.getRandomKeyword();
                return this.buscarConsejo(secondKeyword).pipe(
                    map(consejos => {
                        if (consejos && consejos.length > 0) {
                            const randomIndex = Math.floor(Math.random() * consejos.length);
                            return consejos[randomIndex];
                        }
                        throw new Error('No se encontraron consejos');
                    }),
                    catchError(() => {
                        // Si falla de nuevo, usar consejo aleatorio general como último recurso
                        return this.obtenerConsejoAleatorio();
                    })
                );
            })
        );
    }

    /**
     * Obtiene una palabra clave financiera aleatoria
     */
    private getRandomKeyword(): string {
        const randomIndex = Math.floor(Math.random() * this.financialKeywords.length);
        return this.financialKeywords[randomIndex];
    }

    /**
     * Obtiene un consejo aleatorio de la API (fallback)
     */
    public obtenerConsejoAleatorio(): Observable<Advice> {
        const timestamp = new Date().getTime();
        const url = `${this.apiUrl}/advice?t=${timestamp}`;

        return this.http.get<AdviceResponse>(url).pipe(
            map(response => this.transformToAdvice(response)),
            retry(2),
            catchError(this.handleError)
        );
    }

    /**
     * Busca consejos por palabra clave
     */
    public buscarConsejo(query: string): Observable<Advice[]> {
        if (!query || query.trim().length === 0) {
            return throwError(() => new Error('La búsqueda no puede estar vacía'));
        }

        const url = `${this.apiUrl}/advice/search/${encodeURIComponent(query)}`;

        return this.http.get<AdviceSearchResponse>(url).pipe(
            map(response => {
                if (response.slips && response.slips.length > 0) {
                    return response.slips.map(slip => ({
                        id: slip.id,
                        text: slip.advice,
                        timestamp: new Date()
                    }));
                }
                return [];
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Obtiene un consejo específico por su ID
     */
    public obtenerConsejoPorId(id: number): Observable<Advice> {
        const url = `${this.apiUrl}/advice/${id}`;

        return this.http.get<AdviceResponse>(url).pipe(
            map(response => this.transformToAdvice(response)),
            catchError(this.handleError)
        );
    }

    /**
     * Transforma la respuesta de la API a nuestro modelo Advice
     */
    private transformToAdvice(response: AdviceResponse): Advice {
        return {
            id: response.slip.id,
            text: response.slip.advice,
            timestamp: new Date()
        };
    }

    /**
     * Manejo de errores robusto
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Ocurrió un error al obtener el consejo';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
        }

        console.error('Error en ChatbotService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Obtiene la lista completa de palabras clave financieras
     * (útil para debugging o mostrar al usuario)
     */
    public getFinancialKeywords(): string[] {
        return [...this.financialKeywords];
    }
}
