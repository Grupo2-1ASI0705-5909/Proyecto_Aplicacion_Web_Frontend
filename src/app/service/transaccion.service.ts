import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaccion } from '../model/Transaccion';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private url = `${environment.apiUrl}/transacciones`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.url);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  obtenerTransaccionesConCripto(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/cripto`);
  }

  obtenerRecientes(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/recientes`);
  }

  crear(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.url, transaccion);
  }

  obtenerPorUsuario(usuarioId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/usuario/${usuarioId}`);
  }

  calcularTotalFiatPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/total-fiat`);
  }

  calcularTotalCriptoPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/total-cripto`);
  }

  obtenerPorComercio(comercioId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/comercio/${comercioId}`);
  }

  actualizar(id: number, transaccion: Transaccion): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.url}/${id}`, transaccion);
  }

  cambiarEstado(id: number, estado: string): Observable<Transaccion> {
    return this.http.patch<Transaccion>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  obtenerPorId(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.url}/${id}`);
  }

  obtenerPorEstado(estado: string): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/estado/${estado}`);
  }
}
