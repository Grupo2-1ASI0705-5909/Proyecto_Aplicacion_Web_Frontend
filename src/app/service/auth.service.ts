import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/login'; 

  constructor(private http: HttpClient, private router: Router) { }

  login(credenciales: any): Observable<any> {

    return this.http.post<any>(this.url, credenciales).pipe(
      tap((response) => {

        if (response.token) {
          localStorage.setItem('token', response.token);
        } else if (response.jwtToken) { 
           localStorage.setItem('token', response.jwtToken);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token'); 
  }
  

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
