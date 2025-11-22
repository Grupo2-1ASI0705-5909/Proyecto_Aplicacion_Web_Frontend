export interface Comercio {
  comercioId?: number;
  usuarioId: number;
  nombreComercial: string;
  ruc: string;
  direccion: string;
  categoria: string;
  estado: boolean;
  createdAt?: string;
}
