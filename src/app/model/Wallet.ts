import { Usuario } from './Usuario';
import { Criptomoneda } from './Criptomoneda';

export interface Wallet {
  walletId?: number;
  usuarioId: number;
  criptoId: number;
  usuario?: Usuario;
  criptomoneda?: Criptomoneda;
  direccion: string;
  saldo: number;
  estado: boolean;
  ultimaActualizacion?: string; 
}
