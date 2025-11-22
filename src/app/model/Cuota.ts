import { PlanPago } from './PlanPago';

export interface Cuota {
  cuotaId?: number;
  planPagoId: number;
  numeroCuota: number;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: string;
  planPago?: PlanPago;
  vencida?: boolean;
}
