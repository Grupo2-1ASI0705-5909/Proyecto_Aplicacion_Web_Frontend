import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wallet } from '../model/Wallet';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private url = `${environment.apiUrl}/wallets`;


  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.url);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<Wallet> {
    return this.http.patch<Wallet>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  actualizarSaldo(id: number, nuevoSaldo: number): Observable<Wallet> {
    return this.http.patch<Wallet>(`${this.url}/${id}/saldo?nuevoSaldo=${nuevoSaldo}`, {});
  }

  obtenerWalletsConSaldoMayorA(saldoMinimo: number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}/saldo-mayor?saldoMinimo=${saldoMinimo}`);
  }

  crear(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.url, wallet);
  }

  obtenerPorId(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.url}/${id}`);
  }

  actualizar(id: number, wallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.url}/${id}`, wallet);
  }

  obtenerPorUsuario(usuarioId: number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}/usuario/${usuarioId}`);
  }

  obtenerPorUsuarioYCripto(usuarioId: number, criptoId: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.url}/usuario/${usuarioId}/cripto/${criptoId}`);
  }

  obtenerSaldoTotalUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/saldo-total`);
  }
}
