/**
 * Interfaz para la respuesta de CoinGecko API
 * Endpoint: /simple/price
 */
export interface CoinGeckoPriceResponse {
    [cryptoId: string]: {
        usd: number;
        usd_24h_change?: number;
        last_updated_at?: number;
    };
}

/**
 * Modelo de datos de precio de criptomoneda
 */
export interface CryptoPriceData {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    change24h: number;
    lastUpdated?: Date;
}

/**
 * Mapeo de IDs de CoinGecko a información de criptomonedas
 */
export const CRYPTO_INFO: { [key: string]: { symbol: string; name: string } } = {
    'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
    'ethereum': { symbol: 'ETH', name: 'Ethereum' },
    'tether': { symbol: 'USDT', name: 'Tether' },
    'binancecoin': { symbol: 'BNB', name: 'Binance Coin' },
    'ripple': { symbol: 'XRP', name: 'Ripple' },
    'cardano': { symbol: 'ADA', name: 'Cardano' },
    'solana': { symbol: 'SOL', name: 'Solana' },
    'polkadot': { symbol: 'DOT', name: 'Polkadot' }
};
