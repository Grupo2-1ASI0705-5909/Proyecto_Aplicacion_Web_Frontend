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
  
  // ID TEMPORAL (Cámbialo cuando tengas el login real)
  usuarioIdActual = 1; 

  constructor(
    private planService: PlanPagoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.planService.obtenerPorUsuario(this.usuarioIdActual).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        console.log('Planes cargados:', data);
      },
      error: (err) => console.error('Error al cargar planes:', err)
    });
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
