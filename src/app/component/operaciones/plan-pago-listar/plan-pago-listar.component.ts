import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PlanPago } from '../../../model/PlanPago';
import { PlanPagoService } from '../../../service/plan-pago.service';
import { CuotaDialogComponent } from '../cuota-dialog/cuota-dialog.component';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UsuarioService } from '../../../service/usuario.service';
import { LoginService } from '../../../service/login-service';

@Component({
  selector: 'app-plan-pago-listar',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, 
    MatIconModule, MatDialogModule,RouterLink,MatPaginatorModule, MatFormFieldModule, MatInputModule],
  templateUrl: './plan-pago-listar.component.html',
  styleUrl: './plan-pago-listar.component.css'
})
export class PlanPagoListarComponent implements OnInit{
dataSource = new MatTableDataSource<PlanPago>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Nombres de columnas para la tabla
  displayedColumns: string[] = ['id', 'fechaInicio', 'fechaFin', 'monto', 'interes', 'cuotas', 'acciones'];
  
  usuarioIdActual: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private planService: PlanPagoService,
    private dialog: MatDialog,
    private loginService: LoginService, // Para saber quién es
    private usuarioService: UsuarioService, // Para buscar su ID
  ) {}

  ngOnInit(): void {
    this.verificarPermisosYCargar();
  }

  verificarPermisosYCargar() {
    // 1. Verificamos el Rol
    const roles = this.loginService.showRole();
    this.isAdmin = (roles && JSON.stringify(roles).includes('ADMINISTRADOR')) || false;

    if (this.isAdmin) {
      // CASO A: Es ADMIN -> Ve TODAS las wallets del sistema
      // Agregamos columna propietario para que el admin sepa de quién es
      this.displayedColumns = ['id', 'fechaInicio', 'fechaFin', 'monto', 'interes', 'cuotas'];
      this.cargarTodas();
    } else {
      // CASO B: Es USUARIO -> Ve SOLO SUS wallets
      this.displayedColumns = ['id', 'fechaInicio', 'fechaFin', 'monto', 'interes', 'cuotas'];
      this.cargarSoloMias();
    }
  }

  cargarTodas() {
    this.planService.obtenerTodos().subscribe(data => {
      this.dataSource.data = data;
      // (Opcional) Podrías sumar todos los saldos aquí si quisieras un total global
    });
  }

  cargarSoloMias() {
    // 1. Obtenemos el email del token
    const email = this.loginService.getUsuarioActual();

    if (email) {
      // 2. Buscamos el ID del usuario en la BD
      this.usuarioService.obtenerPorEmail(email).subscribe(usuario => {
        if (usuario && usuario.usuarioId) {
          
          // 3. Guardamos el ID real
          this.usuarioIdActual = usuario.usuarioId;
          
          // 4. AHORA SÍ: Cargamos los PLANES de este usuario (Lógica acoplada)
          this.planService.obtenerPorUsuario(this.usuarioIdActual).subscribe({
            next: (data) => {
              this.dataSource.data = data;
              
              // Si tienes paginador, conéctalo aquí
              if (this.paginator) {
                this.dataSource.paginator = this.paginator;
              }
              
              console.log('Planes cargados:', data);
            },
            error: (err) => console.error('Error al cargar planes:', err)
          });

        }
      });
    }
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  verCuotas(plan: PlanPago) {
    this.dialog.open(CuotaDialogComponent, {
      width: '700px',
      data: plan // Pasamos el objeto PlanPago completo
    });
  }
}
