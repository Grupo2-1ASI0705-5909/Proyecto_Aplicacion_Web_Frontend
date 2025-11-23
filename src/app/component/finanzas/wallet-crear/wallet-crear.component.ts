import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Criptomoneda } from '../../../model/Criptomoneda';
import { WalletService } from '../../../service/wallet.service';
import { CriptomonedaService } from '../../../service/criptomoneda.service';

@Component({
  selector: 'app-wallet-crear', 
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatSlideToggleModule, MatSnackBarModule
  ],
  templateUrl: './wallet-crear.component.html', 
  styleUrl: './wallet-crear.component.css'
})
export class WalletCrearComponent implements OnInit{
form: FormGroup;
  criptos: Criptomoneda[] = [];
  esEdicion = false;
  idEditar: number | null = null;
  usuarioIdActual = 1; 

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private criptoService: CriptomonedaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      criptoId: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      estado: [true],
      usuarioId: [this.usuarioIdActual]
    });
  }

  ngOnInit(): void {
    this.cargarCriptos();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
        this.cargarDatos(this.idEditar);
      }
    });
  }

  cargarCriptos() {
    this.criptoService.obtenerActivas().subscribe(data => {
      this.criptos = data;
    });
  }

  cargarDatos(id: number) {
    this.walletService.obtenerPorId(id).subscribe(data => {
      this.form.patchValue({
        criptoId: data.criptoId || data.criptomoneda?.criptoId,
        direccion: data.direccion,
        saldo: data.saldo,
        estado: data.estado,
        usuarioId: data.usuarioId
      });
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const wallet = this.form.value;

    if (this.esEdicion && this.idEditar) {
      this.walletService.actualizar(this.idEditar, wallet).subscribe(() => {
        this.mostrarExito('Wallet actualizada');
      });
    } else {
      this.walletService.crear(wallet).subscribe(() => {
        this.mostrarExito('Wallet registrada con éxito');
      });
    }
  }

  mostrarExito(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/wallets']);
  }
}
