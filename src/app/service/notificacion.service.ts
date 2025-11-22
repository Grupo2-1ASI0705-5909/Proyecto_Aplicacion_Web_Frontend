import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from '../model/Notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private url = 'http://localhost:8080/api/notificaciones';

  constructor(private http: HttpClient) { }

  crear(notificacion: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(this.url, notificacion);
  }

  obtenerTodos(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.url}/${id}`);
  }

  actualizar(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.url}/${id}`, notificacion);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  marcarComoLeida(id: number): Observable<Notificacion> {
    return this.http.patch<Notificacion>(`${this.url}/${id}/leer`, {});
  }

  obtenerPorUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}`);
  }

  obtenerNoLeidasPorUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/usuario/${usuarioId}/no-leidas`);
  }

  obtenerRecientes(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/recientes`);
  }

  marcarTodasComoLeidas(usuarioId: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/usuario/${usuarioId}/marcar-todas-leidas`, {});
  }

  contarNoLeidasPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/contar-no-leidas`);
  }

  obtenerPorTipo(tipo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/tipo/${tipo}`);
  }
}
