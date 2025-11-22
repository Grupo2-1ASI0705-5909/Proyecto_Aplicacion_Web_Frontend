import { Rol } from './Rol';

export interface Usuario {
  usuarioId?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  passwordHash?: string;
  estado: boolean;
  createdAt?: string;
  rolId: number;
  rol?: Rol;
}
