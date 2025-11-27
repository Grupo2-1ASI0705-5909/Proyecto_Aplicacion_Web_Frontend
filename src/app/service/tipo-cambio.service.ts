import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { TipoCambio } from '../model/TipoCambio';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  private url = `${environment.apiUrl}/tipos-cambio`;


  constructor(private http: HttpClient) { }

  crear(tipoCambio: TipoCambio): Observable<TipoCambio> {
    return this.http.post<TipoCambio>(this.url, tipoCambio);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  calcularPromedioTasas(desde: string, hasta: string, fechaInicio: string, fechaFin: string): Observable<number> {
    return this.http.get<number>(`${this.url}/promedio?desde=${desde}&hasta=${hasta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  obtenerHistorialTasas(desde: string, hasta: string): Observable<TipoCambio[]> {
    return this.http.get<TipoCambio[]>(`${this.url}/historial?desde=${desde}&hasta=${hasta}`);
  }

  obtenerTodos(): Observable<TipoCambio[]> {
    return this.http.get<TipoCambio[]>(this.url);
  }

  obtenerPorId(id: number): Observable<TipoCambio> {
    return this.http.get<TipoCambio>(`${this.url}/${id}`);
  }

  obtenerTasaMasReciente(desde: string, hasta: string): Observable<TipoCambio> {
    return this.http.get<TipoCambio>(`${this.url}/tasa-actual?desde=${desde}&hasta=${hasta}`);
  }

  obtenerTasasMasRecientes(): Observable<TipoCambio[]> {
    return this.http.get<TipoCambio[]>(`${this.url}/tasas-recientes`);
  }
}
