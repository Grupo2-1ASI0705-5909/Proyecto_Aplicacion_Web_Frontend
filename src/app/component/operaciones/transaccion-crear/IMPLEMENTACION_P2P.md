# 🚀 SISTEMA DE PAGOS HÍBRIDO P2P + COMERCIO

## ARQUITECTURA DE LA SOLUCIÓN

### 1. FRONTEND (Angular)

#### Cambios en `transaccion-crear.component.ts`:

```typescript
// NUEVAS PROPIEDADES
tipoTransaccion: 'comercio' | 'p2p' = 'comercio';
emailDestinatario: string = '';
usuarioDestinatario: any = null;
walletDestinatario: Wallet | null = null;
validandoDestinatario: boolean = false;
```

#### Nuevo FormControl
```typescript
this.form = this.fb.group({
  tipoTransaccion: ['comercio', Validators.required],
  comercioId: [''],  // Condicional
  emailDestinatario: [''],  // Condicional
  criptoId: ['', Validators.required],
  metodoPagoId: ['', Validators.required],
  montoTotalFiat: [0, [Validators.required, Validators.min(0.01)]],
  // ... resto de campos
});
```

#### Métodos Clave

1. **onTipoTransaccionChange()**
   - Actualiza validadores según tipo
   - Limpia campos no necesarios

2. **validarDestinatarioP2P(email: string)**
   - Busca usuario por email
   - Valida existencia de wallet compatible
   - Muestra errores específicos

3. **procesarPagoP2P()**
   - Descuenta del remitente
   - Suma al destinatario
   - Crea transacción bilateral
   - Genera notificación

### 2. BACKEND (Spring Boot)

#### Nuevo Endpoint: `/api/transacciones/p2p`

```java
@PostMapping("/p2p")
public ResponseEntity<TransaccionDTO> transferirP2P(
    @RequestBody TransaccionP2PRequest request,
    @RequestHeader("Authorization") String token
) {
    // 1. Validar usuario remitente
    // 2. Buscar usuario destinatario por email
    // 3. Validar wallets compatibles
    // 4. Validar saldo suficiente
    // 5. Ejecutar transacción atómica (ACID)
    // 6. Crear notificación
    // 7. Retornar resultado
}
```

#### Lógica de Transferencia P2P

```java
@Transactional
public TransaccionDTO ejecutarTransferenciaP2P(
    Long remitenteId,
    String emailDestinatario,
    Long criptoId,
    BigDecimal montoUSD
) {
    // Paso 1: Obtener usuario destinatario
    Usuario destinatario = usuarioRepository
        .findByEmail(emailDestinatario)
        .orElseThrow(() -> new RuntimeException("Usuario destinatario no encontrado"));

    // Paso 2: Obtener wallets
    Wallet walletRemitente = walletRepository
        .findByUsuarioUsuarioIdAndCriptomonedaCriptoId(remitenteId, criptoId)
        .orElseThrow(() -> new RuntimeException("No tienes wallet para esta criptomoneda"));

    Wallet walletDestinatario = walletRepository
        .findByUsuarioUsuarioIdAndCriptomonedaCriptoId(destinatario.getUsuarioId(), criptoId)
        .orElseThrow(() -> new RuntimeException(
            String.format("El usuario %s no tiene wallet para %s",
                emailDestinatario, walletRemitente.getCriptomoneda().getCodigo())
        ));

    // Paso 3: Calcular monto en cripto
    BigDecimal tasa = tipoCambioService.obtenerTasaActual(cripto.getCodigo(), "USD");
    BigDecimal montoCripto = montoUSD.divide(tasa, 8, RoundingMode.HALF_UP);

    // Paso 4: Validar saldo
    if (walletRemitente.getSaldo().compareTo(montoCripto) < 0) {
        throw new RuntimeException("Saldo insuficiente");
    }

    // Paso 5: DOBLE ENTRADA CONTABLE
    // Restar del remitente
    walletRemitente.setSaldo(walletRemitente.getSaldo().subtract(montoCripto));
    walletRepository.save(walletRemitente);

    // Sumar al destinatario
    walletDestinatario.setSaldo(walletDestinatario.getSaldo().add(montoCripto));
    walletRepository.save(walletDestinatario);

    // Paso 6: Crear transacción
    Transaccion transaccion = new Transaccion();
    transaccion.setUsuario(remitente);
    transaccion.setUsuarioDestinatario(destinatario);  // NUEVO CAMPO
    transaccion.setTipoTransaccion("P2P");  // NUEVO CAMPO
    transaccion.setMontoTotalFiat(montoUSD);
    transaccion.setMontoTotalCripto(montoCripto);
    transaccion.setEstado("COMPLETADA");
    transaccionRepository.save(transaccion);

    // Paso 7: Crear notificación
    notificacionService.crearNotificacion(
        destinatario.getUsuarioId(),
        String.format("Has recibido %s %s de %s",
            montoCripto, cripto.getCodigo(), remitente.getEmail())
    );

    return convertirADTO(transaccion);
}
```

### 3. MODELO DE DATOS

#### Actualización de `Transaccion.java`

```java
@Entity
public class Transaccion {
    // ... campos existentes ...

    @Column(length = 20)
    private String tipoTransaccion; // "COMERCIO" o "P2P"

    @ManyToOne
    @JoinColumn(name = "usuario_destinatario_id")
    private Usuario usuarioDestinatario;  // Solo para P2P

    // ... getters y setters ...
}
```

#### Nuevo Model: `Notificacion.java`

```java
@Entity
@Table(name = "notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificacionId;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String mensaje;

    private String tipo; // "TRANSFERENCIA_RECIBIDA", "PAGO_RECIBIDO", etc.

    private Boolean leida = false;

    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
```

### 4. VALIDACIONES DE SEGURIDAD

#### Frontend
- ✅ Email válido (regex)
- ✅ Usuario no puede enviarse a sí mismo
- ✅ Saldo suficiente antes de enviar
- ✅ Wallet compatible validada en tiempo real

#### Backend
- ✅ Validación de usuario destinatario existe
- ✅ Validación de wallet compatible
- ✅ Transacción atómica (@Transactional)
- ✅ Rollback automático si falla cualquier paso
- ✅ Logs de auditoría

### 5. FLUJO DE USUARIO (UX)

```
1. Usuario abre "Realizar Pago"
2. Ve selector: [Comercio] o [Usuario]
3. Selecciona "Transferir a Usuario"
   ↓
4. UI cambia: aparece input de email
5. Usuario escribe email y sale del campo (blur)
   ↓
6. Sistema busca usuario automáticamente
7. Si existe: Muestra nombre + verificación ✓
8. Si no existe: Error "Usuario no encontrado"
   ↓
9. Usuario selecciona criptomoneda
10. Sistema valida wallet del destinatario
11. Si no tiene wallet: Error específico
    ↓
12. Usuario ingresa monto USD
13. Sistema calcula cripto necesario
14. Valida saldo propio
    ↓
15. Usuario confirma
16. Sistema ejecuta:
    - Resta saldo remitente
    - Suma saldo destinatario
    - Crea transacción
    - Envía notificación
    ↓
17. Confirmación: "Transferencia completada"
```

### 6. MENSAJES DE ERROR PROFESIONALES

```typescript
const ERRORES_P2P = {
  USUARIO_NO_ENCONTRADO: 'El email ingresado no corresponde a ningún usuario registrado',
  MISMO_USUARIO: 'No puedes transferirte dinero a ti mismo',
  SIN_WALLET_DESTINO: (email: string, crypto: string) => 
    `${email} no tiene una billetera ${crypto} habilitada y no puede recibir estos fondos`,
  SALDO_INSUFICIENTE: (necesario: number, disponible: number, crypto: string) =>
    `Necesitas ${necesario} ${crypto} pero solo tienes ${disponible} ${crypto}`,
  ERROR_TRANSFERENCIA: 'Error al procesar la transferencia. Por favor, intenta nuevamente'
};
```

### 7. PRÓXIMOS PASOS PARA IMPLEMENTACIÓN

1. ✅ Actualizar modelo de Transaccion (agregar campos)
2. ✅ Crear modelo Notificacion y su servicio
3. ✅ Implementar endpoint /api/transacciones/p2p
4. ✅ Actualizar frontend con selector de tipo
5. ✅ Implementar validación de email en tiempo real
6. ✅ Crear componente de notificaciones (campana)
7. ✅ Testing exhaustivo del flujo completo
8. ✅ Agregar logs de auditoría
9. ✅ Documentar API endpoints

### 8. CONSIDERACIONES DE PRODUCCIÓN

- **Seguridad**: Validar que el token JWT corresponda al usuario remitente
- **Rate Limiting**: Limitar transferencias P2P por usuario (ej: máx 10 por hora)
- **Fees**: Considerar comisiones por transacción
- **Confirmación 2FA**: Para montos altos, requerir segundo factor
- **Historial**: Diferenciar visualmente entre pagos a comercio y transferencias P2P

---

## CONCLUSIÓN

Esta arquitectura implementa un sistema robusto y seguro de transferencias P2P manteniendo la funcionalidad existente de pagos a comercios. La solución es escalable, mantiene integridad de datos (ACID), y proporciona una excelente experiencia de usuario.
