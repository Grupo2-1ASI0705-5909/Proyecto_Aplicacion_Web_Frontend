// Archivo: src/app/validators/email-async.validator.ts
// Validador asíncrono para verificar si un email ya está en uso

import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, first } from 'rxjs/operators';
import { UsuarioService } from '../service/usuario.service';

export function emailUnicoValidator(
    usuarioService: UsuarioService,
    idActual?: number
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }

        // Debounce de 500ms para no hacer peticiones en cada tecla
        return timer(500).pipe(
            switchMap(() =>
                usuarioService.obtenerPorEmail(control.value).pipe(
                    map(usuario => {
                        // Si existe un usuario con ese email y no es el actual (en caso de edición)
                        if (usuario && usuario.usuarioId !== idActual) {
                            return { emailEnUso: true };
                        }
                        return null;
                    }),
                    catchError(() => of(null)) // Si no existe (404), está disponible
                )
            ),
            first()
        );
    };
}
