import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log('[WalletService] Token retrieval:', token ? 'FOUND' : 'MISSING');

    let headers = new HttpHeaders();
    if (token) {
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authHeader);
      console.log('[WalletService] Authorization header set:', authHeader.substring(0, 20) + '...');
    } else {
      console.warn('[WalletService] No token found in sessionStorage');
    }
    return headers;
  }

  obtenerTodos(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.url, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  cambiarEstado(id: number, estado: boolean): Observable<Wallet> {
    return this.http.patch<Wallet>(`${this.url}/${id}/estado?estado=${estado}`, {}, { headers: this.getHeaders() });
  }

  actualizarSaldo(id: number, nuevoSaldo: number): Observable<Wallet> {
    return this.http.patch<Wallet>(`${this.url}/${id}/saldo?nuevoSaldo=${nuevoSaldo}`, {}, { headers: this.getHeaders() });
  }

  obtenerWalletsConSaldoMayorA(saldoMinimo: number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}/saldo-mayor?saldoMinimo=${saldoMinimo}`, { headers: this.getHeaders() });
  }

  crear(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.url, wallet, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  actualizar(id: number, wallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.url}/${id}`, wallet, { headers: this.getHeaders() });
  }

  obtenerPorUsuario(usuarioId: number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  obtenerPorUsuarioYCripto(usuarioId: number, criptoId: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.url}/usuario/${usuarioId}/cripto/${criptoId}`, { headers: this.getHeaders() });
  }

  obtenerSaldoTotalUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/usuario/${usuarioId}/saldo-total`, { headers: this.getHeaders() });
  }

  // ✅ NUEVO: Obtener patrimonio en USD
  obtenerPatrimonioUSD(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/patrimonio/${usuarioId}`, { headers: this.getHeaders() });
  }
}
