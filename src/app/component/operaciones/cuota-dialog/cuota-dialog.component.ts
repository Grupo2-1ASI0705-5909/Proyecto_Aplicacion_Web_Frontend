import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Cuota } from '../../../model/Cuota';
import { PlanPago } from '../../../model/PlanPago';
import { CuotaService } from '../../../service/cuota.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cuota-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule, MatChipsModule,MatIcon],
  templateUrl: './cuota-dialog.component.html',
  styleUrl: './cuota-dialog.component.css'
})
export class CuotaDialogComponent implements OnInit{
cuotas: Cuota[] = [];
  displayedColumns: string[] = ['numero', 'vencimiento', 'monto', 'estado'];

  constructor(
    public dialogRef: MatDialogRef<CuotaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public plan: PlanPago, // Recibimos el plan seleccionado
    private cuotaService: CuotaService
  ) {}

  ngOnInit(): void {
    // Cargamos las cuotas de este plan específico
    if (this.plan.planPagoId) {
      this.cuotaService.obtenerPorPlanPago(this.plan.planPagoId).subscribe(data => {
        this.cuotas = data;
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  // Función para pintar bonito el estado
  getColorEstado(estado: string): string {
    // Ajusta 'PAGADA' según como lo devuelva tu backend (puede ser 'Pagada', 'COMPLETADA', etc)
    return estado === 'PAGADA' ? 'primary' : 'warn';
  }
}
