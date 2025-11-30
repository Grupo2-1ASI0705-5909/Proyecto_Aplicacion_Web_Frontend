import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authHeader);
    }
    return headers;
  }

  obtenerTodos(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.url, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  obtenerTransaccionesConCripto(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/cripto`, { headers: this.getHeaders() });
  }

  obtenerRecientes(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/recientes`, { headers: this.getHeaders() });
  }

  crear(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.url, transaccion, { headers: this.getHeaders() });
  }

  obtenerPorUsuario(usuarioId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  calcularTotalFiatPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/total-fiat`, { headers: this.getHeaders() });
  }

  calcularTotalCriptoPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/total-cripto`, { headers: this.getHeaders() });
  }

  obtenerPorComercio(comercioId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/comercio/${comercioId}`, { headers: this.getHeaders() });
  }

  actualizar(id: number, transaccion: Transaccion): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.url}/${id}`, transaccion, { headers: this.getHeaders() });
  }

  cambiarEstado(id: number, estado: string): Observable<Transaccion> {
    return this.http.patch<Transaccion>(`${this.url}/${id}/estado?estado=${estado}`, {}, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  obtenerPorEstado(estado: string): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/estado/${estado}`, { headers: this.getHeaders() });
  }
}
