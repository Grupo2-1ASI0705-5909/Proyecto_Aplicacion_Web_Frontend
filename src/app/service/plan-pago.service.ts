import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { PlanPago } from '../model/PlanPago';

@Injectable({
  providedIn: 'root'
})
export class PlanPagoService {
  private url = `${environment.apiUrl}/planes-pago`;


  constructor(private http: HttpClient) { }

  crear(planPago: PlanPago): Observable<PlanPago> {
    return this.http.post<PlanPago>(this.url, planPago);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  obtenerPlanesVencidos(): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(`${this.url}/vencidos`);
  }

  obtenerPlanesConCuotasPendientes(): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(`${this.url}/con-cuotas-pendientes`);
  }

  calcularInteresTotal(): Observable<number> {
    return this.http.get<number>(`${this.url}/interes-total`);
  }

  obtenerPorUsuario(usuarioId: number): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(`${this.url}/usuario/${usuarioId}`);
  }

  actualizar(id: number, planPago: PlanPago): Observable<PlanPago> {
    return this.http.put<PlanPago>(`${this.url}/${id}`, planPago);
  }

  obtenerPorTransaccion(transaccionId: number): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(`${this.url}/transaccion/${transaccionId}`);
  }

  obtenerTodos(): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(this.url);
  }

  obtenerPorId(id: number): Observable<PlanPago> {
    return this.http.get<PlanPago>(`${this.url}/${id}`);
  }

  obtenerPlanesActivos(): Observable<PlanPago[]> {
    return this.http.get<PlanPago[]>(`${this.url}/activos`);
  }
}
