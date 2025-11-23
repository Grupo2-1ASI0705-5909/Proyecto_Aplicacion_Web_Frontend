import { Usuario } from './Usuario';

export interface Comercio {
  comercioId?: number;
  usuarioId: number;
  usuario?: Usuario; 
  nombreComercial: string;
  ruc: string;
  direccion: string;
  categoria: string;
  estado: boolean;
  createdAt?: string;
}
