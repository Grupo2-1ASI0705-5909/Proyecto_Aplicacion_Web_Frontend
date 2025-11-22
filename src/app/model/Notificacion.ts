import { Usuario } from './Usuario';

export interface Notificacion {
  notificacionId?: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  fechaEnvio?: string; // LocalDateTime
  leido: boolean;
  usuario?: Usuario;
}
