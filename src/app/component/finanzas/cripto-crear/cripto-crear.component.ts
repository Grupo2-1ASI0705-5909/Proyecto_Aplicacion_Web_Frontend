import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Para el switch de activa
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CriptomonedaService } from '../../../service/criptomoneda.service';

@Component({
  selector: 'app-cripto-crear',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule, 
    MatSlideToggleModule, MatSnackBarModule
  ],
  templateUrl: './cripto-crear.component.html',
  styleUrl: './cripto-crear.component.css'
})
export class CriptoCrearComponent implements OnInit{
form: FormGroup;
  esEdicion = false;
  idEditar: number | null = null;

  constructor(
    private fb: FormBuilder,
    private criptoService: CriptomonedaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      decimales: [8, [Validators.required, Validators.min(0)]], // Por defecto 8
      activa: [true] // Por defecto activa
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
        this.cargarDatos(this.idEditar);
      }
    });
  }

  cargarDatos(id: number) {
    this.criptoService.obtenerPorId(id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const cripto = this.form.value;
    // Aseguramos que el código sea mayúsculas (ej: btc -> BTC)
    cripto.codigo = cripto.codigo.toUpperCase();

    if (this.esEdicion && this.idEditar) {
      this.criptoService.actualizar(this.idEditar, cripto).subscribe(() => {
        this.mostrarExito('Criptomoneda actualizada');
      });
    } else {
      this.criptoService.crear(cripto).subscribe(() => {
        this.mostrarExito('Criptomoneda creada');
      });
    }
  }

  mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/criptomonedas']);
  }
}
