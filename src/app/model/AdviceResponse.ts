/**
 * Interfaz para la respuesta de Advice Slip API
 * Endpoint: /advice
 */
export interface AdviceResponse {
    slip: {
        id: number;
        advice: string;
    };
}

/**
 * Interfaz para búsqueda de consejos
 * Endpoint: /advice/search/{query}
 */
export interface AdviceSearchResponse {
    total_results: string;
    query: string;
    slips: Array<{
        id: number;
        advice: string;
    }>;
}

/**
 * Modelo simplificado de consejo
 */
export interface Advice {
    id: number;
    text: string;
    timestamp?: Date;
}
