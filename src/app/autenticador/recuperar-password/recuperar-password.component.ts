import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-recuperar-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './recuperar-password.component.html',
    styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {
    form: FormGroup;
    enviando = false;
    emailEnviado = false;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    recuperar() {
        if (this.form.invalid) return;

        this.enviando = true;

        // Simulación de llamada al backend
        setTimeout(() => {
            this.enviando = false;
            this.emailEnviado = true;

            this.snackBar.open('Se ha enviado un enlace de recuperación a tu correo.', 'Cerrar', {
                duration: 5000,
                panelClass: ['snackbar-success']
            });
        }, 2000);
    }
}
