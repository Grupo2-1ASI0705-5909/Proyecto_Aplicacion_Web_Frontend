import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuarioService } from '../service/usuario.service';

export function emailUnicoValidator(
    usuarioService: UsuarioService,
    idActual?: number
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        // Validación básica antes de llamar al backend
        if (!control.value || control.value.length < 5 || !control.value.includes('@')) {
            return of(null);
        }

        // Optimización: Esperar a que el usuario deje de escribir
        return timer(500).pipe(
            debounceTime(300),
            distinctUntilChanged(),
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
