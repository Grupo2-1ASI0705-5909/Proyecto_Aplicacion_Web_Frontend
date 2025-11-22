import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  obtenerPorEstado(estado: boolean): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/estado/${estado}`);
  }

  contarUsuariosActivos(): Observable<number> {
    return this.http.get<number>(`${this.url}/contar/activos`);
  }

  obtenerPorRol(rolId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/rol/${rolId}`);
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  obtenerPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/email/${email}`);
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  buscarPorNombre(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/buscar?nombre=${nombre}`);
  }
}
