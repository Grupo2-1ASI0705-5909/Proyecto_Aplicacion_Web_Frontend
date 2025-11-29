import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, switchMap, shareReplay, startWith } from 'rxjs';
import { environment } from '../environment/environment';
import { TipoCambio } from '../model/TipoCambio';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  private url = `${environment.apiUrl}/tipos-cambio`;

  // Observable que emite las tasas más recientes cada 10 segundos
  public tasasEnTiempoReal$: Observable<TipoCambio[]>;

  constructor(private http: HttpClient) {
    // Configurar actualización automática cada 10 segundos
    this.tasasEnTiempoReal$ = interval(10000).pipe(
      startWith(0), // Emitir inmediatamente al suscribirse
      switchMap(() => this.obtenerTasasMasRecientes()),
      shareReplay(1) // Compartir la misma suscripción entre múltiples componentes
    );
  }

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
