import { Usuario } from './Usuario';
import { Criptomoneda } from './Criptomoneda';

export interface Wallet {
  walletId?: number;
  usuarioId: number;
  criptoId: number;
  direccion: string;
  saldo: number;
  estado: boolean;
  ultimaActualizacion?: string;
  usuario?: Usuario;
  criptomoneda?: Criptomoneda;
}
