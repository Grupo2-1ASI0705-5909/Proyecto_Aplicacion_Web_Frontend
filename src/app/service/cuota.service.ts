import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuota } from '../model/Cuota';

@Injectable({
  providedIn: 'root'
})
export class CuotaService {
  private url = 'http://localhost:8080/api/cuotas';

  constructor(private http: HttpClient) { }

  crear(cuota: Cuota): Observable<Cuota> {
    return this.http.post<Cuota>(this.url, cuota);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  obtenerCuotasVencidas(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.url}/vencidas`);
  }

  obtenerCuotasPorVencer(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.url}/por-vencer`);
  }

  pagarCuota(id: number): Observable<Cuota> {
    return this.http.patch<Cuota>(`${this.url}/${id}/pagar`, {});
  }

  obtenerPorUsuario(usuarioId: number): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.url}/usuario/${usuarioId}`);
  }

  obtenerProximaCuotaPorVencer(planPagoId: number): Observable<Cuota> {
    return this.http.get<Cuota>(`${this.url}/plan-pago/${planPagoId}/proxima`);
  }

  calcularTotalPendiente(planPagoId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/plan-pago/${planPagoId}/total-pendiente`);
  }

  actualizar(id: number, cuota: Cuota): Observable<Cuota> {
    return this.http.put<Cuota>(`${this.url}/${id}`, cuota);
  }

  obtenerPorPlanPago(planPagoId: number): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.url}/plan-pago/${planPagoId}`);
  }

  obtenerTodos(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Cuota> {
    return this.http.get<Cuota>(`${this.url}/${id}`);
  }

  obtenerPorEstado(estado: string): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.url}/estado/${estado}`);
  }
}
