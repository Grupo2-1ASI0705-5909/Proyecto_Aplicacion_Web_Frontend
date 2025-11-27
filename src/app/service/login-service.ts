import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../model/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private url = environment.loginUrl;
  private helper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // 1. LOGIN
  login(request: JwtRequest): Observable<any> {
    return this.http.post<any>(this.url, request).pipe(
      tap((response) => {
        const token = response.jwttoken || response.token || response.jwtToken;
        if (token) {
          sessionStorage.setItem('token', token);
        }
      })
    );
  }

  // 2. VERIFICAR
  verificar(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    if (this.helper.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  // 3. MOSTRAR ROL
  showRole(): string | string[] | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = this.helper.decodeToken(token);
      let roles = decodedToken?.roles || decodedToken?.role || decodedToken?.authorities || null;

      if (!roles) return null;

      // Normalizar roles
      if (Array.isArray(roles)) {
        return roles.map((r: string) => r.replace(/^ROLE_/, ''));
      } else {
        return (roles as string).replace(/^ROLE_/, '');
      }
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  // 4. OBTENER USUARIO ACTUAL
  getUsuarioActual(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = this.helper.decodeToken(token);
      return decodedToken?.sub || decodedToken?.email || decodedToken?.username || null;
    } catch (error) {
      return null;
    }
  }

  // 5. OBTENER ID
  getUsuarioId(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = this.helper.decodeToken(token);
      return decodedToken?.userId || decodedToken?.id || null;
    } catch (error) {
      return null;
    }
  }

  // 6. VERIFICAR SI ES ADMIN
  isAdmin(): boolean {
    const role = this.showRole();
    if (!role) return false;

    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => {
      const normalized = r.toUpperCase().replace(/^ROLE_/, '');
      return normalized === 'ADMIN' || normalized === 'ADMINISTRADOR';
    });
  }

  // 7. VERIFICAR SI ES CLIENTE
  isCliente(): boolean {
    const role = this.showRole();
    if (!role) return false;

    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => {
      const normalized = r.toUpperCase().replace(/^ROLE_/, '');
      return normalized === 'CLIENTE' || normalized === 'USER' || normalized === 'USUARIO';
    });
  }

  // 8. VERIFICAR SI ES COMERCIO
  isComercio(): boolean {
    const role = this.showRole();
    if (!role) return false;

    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.some(r => {
      const normalized = r.toUpperCase().replace(/^ROLE_/, '');
      return normalized === 'COMERCIO' || normalized === 'VENDEDOR';
    });
  }

  // 9. LOGOUT
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // 10. EXPIRACIÓN
  getTokenExpirationTime(): Date | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      return this.helper.getTokenExpirationDate(token);
    } catch (error) {
      return null;
    }
  }

  // 11. MINUTOS RESTANTES
  getMinutesUntilExpiration(): number | null {
    const expirationDate = this.getTokenExpirationTime();
    if (!expirationDate) return null;

    const now = new Date();
    const diff = expirationDate.getTime() - now.getTime();
    return Math.floor(diff / 60000);
  }
}