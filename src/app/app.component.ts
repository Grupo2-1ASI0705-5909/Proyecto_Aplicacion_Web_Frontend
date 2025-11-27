import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './service/login-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    RouterLink,      
    MatToolbarModule, 
    MatButtonModule,  
    MatIconModule,MatSidenavModule, 
    MatListModule,MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FRONTEND';
  isAdmin: boolean = false; 
  showFinanzasMenu: boolean = false;
  showSistemaMenu: boolean = false;
  showOperacionesMenu: boolean = false;

  constructor(private loginService: LoginService) {}
  toggleRole() {
    this.isAdmin = !this.isAdmin;
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
  }
}
