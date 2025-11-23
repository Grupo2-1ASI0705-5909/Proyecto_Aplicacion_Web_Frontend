import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../service/usuario.service';
import { RolService } from '../../../service/rol.service';
import { Rol } from '../../../model/Rol';

@Component({
  selector: 'app-usuario-crear',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './usuario-crear.component.html',
  styleUrl: './usuario-crear.component.css'
})
export class UsuarioCrearComponent implements OnInit{
form: FormGroup;
  roles: Rol[] = [];
  esEdicion = false;
  idEditar: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      passwordHash: [''], // Opcional en edición, obligatorio en crear (validar lógica luego)
      rolId: ['', Validators.required],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idEditar = Number(id);
        this.usuarioService.obtenerPorId(this.idEditar).subscribe(data => {
          this.form.patchValue(data);
          // Ojo: passwordHash no se suele devolver ni mostrar por seguridad
        });
      }
    });
  }

  cargarRoles() {
    this.rolService.obtenerTodos().subscribe(data => {
      this.roles = data;
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const usuario = this.form.value;

    if (this.esEdicion && this.idEditar) {
      this.usuarioService.actualizar(this.idEditar, usuario).subscribe(() => {
        this.mostrarMensaje('Usuario actualizado');
      });
    } else {
      this.usuarioService.crear(usuario).subscribe(() => {
        this.mostrarMensaje('Usuario creado');
      });
    }
  }

  mostrarMensaje(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/usuarios']);
  }
}
