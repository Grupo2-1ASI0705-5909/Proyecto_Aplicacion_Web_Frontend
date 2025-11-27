import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../model/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService{
  
private url = 'http://localhost:8080/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

  // 2. VERIFICAR: Revisa si existe el token para proteger rutas
  verificar(): boolean {
    let token = sessionStorage.getItem('token');
    return token != null;
  }

  // 3. MOSTRAR ROL: Decodifica el token para saber quién es (Admin/Usuario)
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    
    // Devuelve el rol (o roles) que vienen dentro del token
    return decodedToken?.roles || decodedToken?.role; 
  }
  getUsuarioActual(): string | null {
    let token = sessionStorage.getItem('token');
    if (!token) return null;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub; 
  }

  // 4. LOGOUT: Cierra sesión
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}