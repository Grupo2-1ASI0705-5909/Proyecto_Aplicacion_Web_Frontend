import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Notificacion } from '../model/Notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private url = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log('[NotificacionService] Token retrieval:', token ? 'FOUND' : 'MISSING');

    let headers = new HttpHeaders();
    if (token) {
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authHeader);
      console.log('[NotificacionService] Authorization header set:', authHeader.substring(0, 30) + '...');
    } else {
      console.warn('[NotificacionService] No token found in sessionStorage');
    }
    return headers;
  }

  crear(notificacion: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(this.url, notificacion, { headers: this.getHeaders() });
  }

  obtenerTodos(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  actualizar(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.url}/${id}`, notificacion, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  marcarComoLeida(id: number): Observable<Notificacion> {
    return this.http.patch<Notificacion>(`${this.url}/${id}/leer`, {}, { headers: this.getHeaders() });
  }

  obtenerPorUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  obtenerNoLeidasPorUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}/no-leidas`, { headers: this.getHeaders() });
  }

  obtenerRecientes(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/recientes`, { headers: this.getHeaders() });
  }

  marcarTodasComoLeidas(usuarioId: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/usuario/${usuarioId}/marcar-todas-leidas`, {}, { headers: this.getHeaders() });
  }

  contarNoLeidasPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/contar-no-leidas`, { headers: this.getHeaders() });
  }

  obtenerPorTipo(tipo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/tipo/${tipo}`, { headers: this.getHeaders() });
  }
}
