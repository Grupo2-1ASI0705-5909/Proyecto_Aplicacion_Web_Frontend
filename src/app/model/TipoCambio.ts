export interface TipoCambio {
  tipoCambioId?: number;
  desdeCodigo: string;
  hastaCodigo: string;
  tasa: number;
  fechaHora: string; // Se recibe como string desde el JSON
  fuente: string;
}
