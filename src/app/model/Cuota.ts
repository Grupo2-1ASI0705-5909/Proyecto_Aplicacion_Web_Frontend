import { PlanPago } from './PlanPago';

export interface Cuota {
  cuotaId?: number;
  planPago?: PlanPago;
  planPagoId?: number; 
  numeroCuota: number;
  monto: number;
  fechaVencimiento: string; 
  fechaPago?: string;       
  estado: string;
  vencida?: boolean; 
}
