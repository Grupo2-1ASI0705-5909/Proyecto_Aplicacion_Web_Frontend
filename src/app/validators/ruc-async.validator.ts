// Archivo: src/app/validators/ruc-async.validator.ts
// Validador asíncrono para verificar si un RUC ya está en uso

import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, first } from 'rxjs/operators';
import { ComercioService } from '../service/comercio.service';

export function rucUnicoValidator(
    comercioService: ComercioService,
    idActual?: number
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }

        // Debounce de 500ms para no hacer peticiones en cada tecla
        return timer(500).pipe(
            switchMap(() =>
                comercioService.obtenerPorRuc(control.value).pipe(
                    map(comercio => {
                        // Si existe un comercio con ese RUC y no es el actual (en caso de edición)
                        if (comercio && comercio.comercioId !== idActual) {
                            return { rucEnUso: true };
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
