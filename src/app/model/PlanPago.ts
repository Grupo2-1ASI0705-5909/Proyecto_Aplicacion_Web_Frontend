import { Transaccion } from './Transaccion';

export interface PlanPago {
  planPagoId?: number;
  transaccionId: number;
  numeroCuotas: number;
  montoPorCuota: number;
  interes: number;
  fechaInicio: string; // LocalDate envía string "YYYY-MM-DD"
  fechaFin: string;
  transaccion?: Transaccion;
}
