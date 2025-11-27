import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cuota } from '../../../model/Cuota';
import { PlanPago } from '../../../model/PlanPago';
import { CuotaService } from '../../../service/cuota.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cuota-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIcon,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cuota-dialog.component.html',
  styleUrl: './cuota-dialog.component.css'
})
export class CuotaDialogComponent implements OnInit {
  cuotas: Cuota[] = [];
  displayedColumns: string[] = ['numero', 'vencimiento', 'monto', 'estado', 'acciones'];
  procesando = false;
  cuotaPagandoId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<CuotaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public plan: PlanPago,
    private cuotaService: CuotaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas(): void {
    if (this.plan.planPagoId) {
      this.cuotaService.obtenerPorPlanPago(this.plan.planPagoId).subscribe(data => {
        this.cuotas = data;
      });
    }
  }

  pagarCuota(cuota: Cuota): void {
    if (!cuota.cuotaId) return;

    const confirmacion = confirm(
      `¿Está seguro de que desea pagar la cuota #${cuota.numeroCuota}?\n` +
      `Monto: S/. ${cuota.monto.toFixed(2)}`
    );

    if (!confirmacion) return;

    this.procesando = true;
    this.cuotaPagandoId = cuota.cuotaId;

    this.cuotaService.pagarCuota(cuota.cuotaId).subscribe({
      next: (cuotaActualizada) => {
        this.snackBar.open('✅ Cuota pagada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Actualizar la cuota en la lista
        const index = this.cuotas.findIndex(c => c.cuotaId === cuota.cuotaId);
        if (index !== -1) {
          this.cuotas[index] = cuotaActualizada;
        }

        this.procesando = false;
        this.cuotaPagandoId = null;
      },
      error: (error) => {
        console.error('Error al pagar cuota:', error);
        this.snackBar.open('❌ Error al pagar la cuota. Intente nuevamente.', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.procesando = false;
        this.cuotaPagandoId = null;
      }
    });
  }

  cerrar() {
    this.dialogRef.close(this.cuotas); // Devolvemos las cuotas actualizadas
  }

  // Función para pintar bonito el estado
  getColorEstado(estado: string): string {
    return estado === 'PAGADA' ? 'primary' : 'warn';
  }

  // Verificar si una cuota puede ser pagada
  puedePagar(cuota: Cuota): boolean {
    return cuota.estado !== 'PAGADA' && !this.procesando;
  }

  // Verificar si se está pagando una cuota específica
  estaPagando(cuota: Cuota): boolean {
    return this.cuotaPagandoId === cuota.cuotaId;
  }
}
