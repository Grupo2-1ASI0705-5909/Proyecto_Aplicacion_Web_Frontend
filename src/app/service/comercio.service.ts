import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comercio } from '../model/Comercio';

@Injectable({
  providedIn: 'root'
})
export class ComercioService {
  private url = 'http://localhost:8080/api/comercios';

  constructor(private http: HttpClient) { }

  crear(comercio: Comercio): Observable<Comercio> {
    return this.http.post<Comercio>(this.url, comercio);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<Comercio> {
    return this.http.patch<Comercio>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  actualizar(id: number, comercio: Comercio): Observable<Comercio> {
    return this.http.put<Comercio>(`${this.url}/${id}`, comercio);
  }

  obtenerPorUsuario(usuarioId: number): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/usuario/${usuarioId}`);
  }

  obtenerTodos(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.url}/${id}`);
  }

  obtenerPorRuc(ruc: string): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.url}/ruc/${ruc}`);
  }

  obtenerPorCategoria(categoria: string): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/categoria/${categoria}`);
  }

  buscarPorNombre(nombre: string): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/buscar?nombre=${nombre}`);
  }

  obtenerActivos(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/activos`);
  }
}
