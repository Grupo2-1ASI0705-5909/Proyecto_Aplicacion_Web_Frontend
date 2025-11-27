import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { LoginService } from './service/login-service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatIcon
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FRONTEND';

  // Referencia al sidenav
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Estado de autenticación y rol
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isCliente: boolean = false;
  usuarioEmail: string | null = null;

  // Estado de menús desplegables
  showFinanzasMenu: boolean = false;
  showSistemaMenu: boolean = false;
  showOperacionesMenu: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar estado inicial
    this.updateAuthState();

    // Actualizar estado cuando cambia la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthState();
    });
  }

  // Actualizar el estado de autenticación y rol
  updateAuthState(): void {
    this.isLoggedIn = this.loginService.verificar();

    if (this.isLoggedIn) {
      this.isAdmin = this.loginService.isAdmin();
      this.isCliente = this.loginService.isCliente();
      this.usuarioEmail = this.loginService.getUsuarioActual();
    } else {
      this.isAdmin = false;
      this.isCliente = false;
      this.usuarioEmail = null;
    }
  }

  toggleOperaciones() {
    this.showOperacionesMenu = !this.showOperacionesMenu;
  }

  toggleFinanzas() {
    this.showFinanzasMenu = !this.showFinanzasMenu;
  }

  toggleSistema() {
    this.showSistemaMenu = !this.showSistemaMenu;
  }

  logout() {
    this.loginService.logout();
    this.updateAuthState();
  }
}
