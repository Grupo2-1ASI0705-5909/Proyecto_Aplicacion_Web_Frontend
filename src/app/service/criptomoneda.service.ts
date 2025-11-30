import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Criptomoneda } from '../model/Criptomoneda';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CriptomonedaService {
  private url = `${environment.apiUrl}/criptomonedas`;


  constructor(private http: HttpClient) { }

  crear(criptomoneda: Criptomoneda): Observable<Criptomoneda> {
    return this.http.post<Criptomoneda>(this.url, criptomoneda);
  }

  actualizar(id: number, criptomoneda: Criptomoneda): Observable<Criptomoneda> {
    return this.http.put<Criptomoneda>(`${this.url}/${id}`, criptomoneda);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, activa: boolean): Observable<Criptomoneda> {
    return this.http.patch<Criptomoneda>(`${this.url}/${id}/estado?activa=${activa}`, {});
  }

  obtenerTodos(): Observable<Criptomoneda[]> {
    return this.http.get<Criptomoneda[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Criptomoneda> {
    return this.http.get<Criptomoneda>(`${this.url}/${id}`);
  }

  obtenerPorCodigo(codigo: string): Observable<Criptomoneda> {
    return this.http.get<Criptomoneda>(`${this.url}/codigo/${codigo}`);
  }

  obtenerActivas(): Observable<Criptomoneda[]> {
    return this.http.get<Criptomoneda[]>(`${this.url}/activas`);
  }

  buscarPorNombre(nombre: string): Observable<Criptomoneda[]> {
    return this.http.get<Criptomoneda[]>(`${this.url}/buscar?nombre=${nombre}`);
  }
}
