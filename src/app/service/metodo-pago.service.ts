import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodoPago } from '../model/MetodoPago';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private url = 'http://localhost:8080/api/metodos-pago';

  constructor(private http: HttpClient) { }

  crear(metodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.url, metodoPago);
  }

  actualizar(id: number, metodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.url}/${id}`, metodoPago);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<MetodoPago> {
    return this.http.patch<MetodoPago>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  contarMetodosActivos(): Observable<number> {
    return this.http.get<number>(`${this.url}/contar/activos`);
  }

  obtenerTodos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.url);
  }

  obtenerPorId(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.url}/${id}`);
  }

  obtenerActivos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.url}/activos`);
  }
}
