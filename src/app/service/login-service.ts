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

  // 1. LOGIN: Recibe el DTO (email, passwordHash)
  login(request: JwtRequest): Observable<any> {
    return this.http.post<any>(this.url, request).pipe(
      tap((response) => {
        // Intentamos capturar el token con varios nombres posibles
        const token = response.jwttoken || response.token || response.jwtToken;

        if (token) {
          sessionStorage.setItem('token', token);
        }
      })
    );
  }

  // 2. VERIFICAR: Revisa si existe el token y si no ha expirado
  verificar(): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    // Verificar si el token ha expirado
    if (this.helper.isTokenExpired(token)) {
      this.logout(); // Limpiar sesión si el token expiró
      return false;
    }

    return true;
  }

  // 3. MOSTRAR ROL: Decodifica el token para saber quién es (Admin/Usuario/Cliente)
  showRole(): string | string[] | null {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const decodedToken = this.helper.decodeToken(token);

      // Devuelve el rol (o roles) que vienen dentro del token
      // Soporta múltiples formatos: 'role', 'roles', 'authorities'
      return decodedToken?.roles || decodedToken?.role || decodedToken?.authorities || null;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  // 4. OBTENER USUARIO ACTUAL: Email o username del token
  getUsuarioActual(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = this.helper.decodeToken(token);
      // Soporta 'sub', 'email', 'username'
      return decodedToken?.sub || decodedToken?.email || decodedToken?.username || null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  // 5. OBTENER ID DEL USUARIO: Para consultas específicas
  getUsuarioId(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = this.helper.decodeToken(token);
      return decodedToken?.userId || decodedToken?.id || null;
    } catch (error) {
      console.error('Error al obtener ID de usuario:', error);
      return null;
    }
  }

  // 6. VERIFICAR SI ES ADMIN
  isAdmin(): boolean {
    const role = this.showRole();
    if (!role) return false;

    if (Array.isArray(role)) {
      return role.some(r => r.toUpperCase() === 'ADMIN' || r.toUpperCase() === 'ADMINISTRADOR');
    }

    return role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'ADMINISTRADOR';
  }

  // 7. VERIFICAR SI ES CLIENTE
  isCliente(): boolean {
    const role = this.showRole();
    if (!role) return false;

    if (Array.isArray(role)) {
      return role.some(r => r.toUpperCase() === 'CLIENTE' || r.toUpperCase() === 'USER');
    }

    return role.toUpperCase() === 'CLIENTE' || role.toUpperCase() === 'USER';
  }

  // 8. LOGOUT: Cierra sesión
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // 9. VERIFICAR EXPIRACIÓN DEL TOKEN (para mostrar advertencias)
  getTokenExpirationTime(): Date | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const expirationDate = this.helper.getTokenExpirationDate(token);
      return expirationDate;
    } catch (error) {
      return null;
    }
  }

  // 10. TIEMPO RESTANTE HASTA LA EXPIRACIÓN (en minutos)
  getMinutesUntilExpiration(): number | null {
    const expirationDate = this.getTokenExpirationTime();
    if (!expirationDate) return null;

    const now = new Date();
    const diff = expirationDate.getTime() - now.getTime();
    return Math.floor(diff / 60000); // Convertir a minutos
  }
}