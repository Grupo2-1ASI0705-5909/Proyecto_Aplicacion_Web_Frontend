import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Transaccion } from '../../../model/Transaccion';

@Component({
  selector: 'app-transaccion-detalle-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './transaccion-detalle-dialog.component.html',
  styleUrl: './transaccion-detalle-dialog.component.css'
})
export class TransaccionDetalleDialogComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: Transaccion) {}
}
