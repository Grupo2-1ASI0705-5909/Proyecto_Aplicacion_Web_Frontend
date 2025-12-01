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

  // Helper para obtener headers manualmente
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authHeader);
    }
    return headers;
  }

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

  // MODIFICADO: Forzar el envío del header Authorization manualmente para evitar el 401
  crear(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.url, wallet, { headers: this.getHeaders() });
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

  // ✅ NUEVO: Obtener patrimonio en USD
  obtenerPatrimonioUSD(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/patrimonio/${usuarioId}`);
  }
}
