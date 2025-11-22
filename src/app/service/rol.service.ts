import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../model/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  crear(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.url, rol);
  }

  obtenerTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  obtenerPorNombre(nombre: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/nombre/${nombre}`);
  }

  actualizar(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}/${id}`, rol);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
