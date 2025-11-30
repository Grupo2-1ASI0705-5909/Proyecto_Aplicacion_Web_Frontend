import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "../service/login-service";

export const seguridadGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); // Obtenemos el servicio
  const router = inject(Router);         // Obtenemos el router

  // 1. Llama al método verificar() del servicio para ver si existe un token
  const estaVerificado = loginService.verificar();

  // 2. Si NO está verificado, lo manda al Login
  if (!estaVerificado) {
    router.navigate(['/login']);
    return false; // Bloquea el acceso a la ruta solicitada
  }
  
  // 3. Si SÍ está verificado, permite el acceso (true)
  return true;
};