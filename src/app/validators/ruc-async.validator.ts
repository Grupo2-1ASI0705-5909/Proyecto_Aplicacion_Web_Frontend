import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ComercioService } from '../service/comercio.service';

export function rucUnicoValidator(
    comercioService: ComercioService,
    idActual?: number
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        // Validación básica: RUC debe tener 11 dígitos
        if (!control.value || control.value.length !== 11) {
            return of(null);
        }

        // Optimización: Esperar a que el usuario deje de escribir
        return timer(500).pipe(
            debounceTime(300),
            distinctUntilChanged(),
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
