import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/Usuario';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;


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
    const token = sessionStorage.getItem('token');
    console.log('UsuarioService: Token raw:', token ? 'Presente' : 'NULL');

    let headers = new HttpHeaders();
    if (token) {
      // Evitar doble Bearer si el token ya lo trae
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authHeader);
      console.log('UsuarioService: Header Authorization seteado:', authHeader.substring(0, 15) + '...');
    } else {
      console.warn('UsuarioService: No hay token en sessionStorage');
    }

    return this.http.get<Usuario>(`${this.url}/email/${email}`, { headers });
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  buscarPorNombre(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/buscar?nombre=${nombre}`);
  }
}
