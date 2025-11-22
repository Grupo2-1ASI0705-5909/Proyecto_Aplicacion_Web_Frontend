import { Usuario } from './Usuario';
import { Comercio } from './Comercio';
import { MetodoPago } from './MetodoPago';
import { Criptomoneda } from './Criptomoneda';
import { TipoCambio } from './TipoCambio';

export interface Transaccion {
  transaccionId?: number;
  usuarioId: number;
  comercioId: number;
  metodoPagoId: number;
  criptoId: number;
  tipoCambioId: number;
  codigoMoneda: string;
  montoTotalFiat: number;
  montoTotalCripto: number;
  tasaAplicada: number;
  txHash: string;
  fechaTransaccion?: string;
  estado: string;
  usuario?: Usuario;
  comercio?: Comercio;
  metodoPago?: MetodoPago;
  criptomoneda?: Criptomoneda;
  tipoCambio?: TipoCambio;
}
