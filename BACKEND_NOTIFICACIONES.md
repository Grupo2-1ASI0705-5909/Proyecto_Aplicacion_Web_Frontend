# Implementación de Notificaciones en el Backend (Spring Boot)

Copia y pega estas clases en tu proyecto de Backend (Spring Boot) para habilitar el sistema de notificaciones.

## 1. Entidad (Entity)
`src/main/java/com/upc/proyecto/model/Notificacion.java`

```java
package com.upc.proyecto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificacionId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String mensaje;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(nullable = false)
    private boolean leido = false;

    @PrePersist
    public void prePersist() {
        if (this.fechaEnvio == null) {
            this.fechaEnvio = LocalDateTime.now();
        }
    }
}
```

## 2. Repositorio (Repository)
`src/main/java/com/upc/proyecto/repository/NotificacionRepository.java`

```java
package com.upc.proyecto.repository;

import com.upc.proyecto.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    
    List<Notificacion> findByUsuarioIdOrderByFechaEnvioDesc(Long usuarioId);
    
    List<Notificacion> findByUsuarioIdAndLeidoFalseOrderByFechaEnvioDesc(Long usuarioId);
    
    long countByUsuarioIdAndLeidoFalse(Long usuarioId);

    @Modifying
    @Transactional
    @Query("UPDATE Notificacion n SET n.leido = true WHERE n.usuarioId = :usuarioId")
    void marcarTodasComoLeidas(Long usuarioId);
}
```

## 3. Servicio (Service)
`src/main/java/com/upc/proyecto/service/NotificacionService.java`

```java
package com.upc.proyecto.service;

import com.upc.proyecto.model.Notificacion;
import com.upc.proyecto.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public Notificacion crear(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public List<Notificacion> obtenerPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }

    public List<Notificacion> obtenerNoLeidas(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidoFalseOrderByFechaEnvioDesc(usuarioId);
    }

    public long contarNoLeidas(Long usuarioId) {
        return notificacionRepository.countByUsuarioIdAndLeidoFalse(usuarioId);
    }

    public Notificacion marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id).orElse(null);
        if (notificacion != null) {
            notificacion.setLeido(true);
            return notificacionRepository.save(notificacion);
        }
        return null;
    }

    public void marcarTodasComoLeidas(Long usuarioId) {
        notificacionRepository.marcarTodasComoLeidas(usuarioId);
    }
    
    public void eliminar(Long id) {
        notificacionRepository.deleteById(id);
    }
}
```

## 4. Controlador (Controller)
`src/main/java/com/upc/proyecto/controller/NotificacionController.java`

```java
package com.upc.proyecto.controller;

import com.upc.proyecto.model.Notificacion;
import com.upc.proyecto.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:4200") // Ajusta según tu frontend
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @PostMapping
    public ResponseEntity<Notificacion> crear(@RequestBody Notificacion notificacion) {
        return new ResponseEntity<>(notificacionService.crear(notificacion), HttpStatus.CREATED);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return new ResponseEntity<>(notificacionService.obtenerPorUsuario(usuarioId), HttpStatus.OK);
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> obtenerNoLeidas(@PathVariable Long usuarioId) {
        return new ResponseEntity<>(notificacionService.obtenerNoLeidas(usuarioId), HttpStatus.OK);
    }

    @GetMapping("/usuario/{usuarioId}/contar-no-leidas")
    public ResponseEntity<Long> contarNoLeidas(@PathVariable Long usuarioId) {
        return new ResponseEntity<>(notificacionService.contarNoLeidas(usuarioId), HttpStatus.OK);
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long id) {
        Notificacion notificacion = notificacionService.marcarComoLeida(id);
        if (notificacion != null) {
            return new ResponseEntity<>(notificacion, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PatchMapping("/usuario/{usuarioId}/marcar-todas-leidas")
    public ResponseEntity<Void> marcarTodasComoLeidas(@PathVariable Long usuarioId) {
        notificacionService.marcarTodasComoLeidas(usuarioId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        notificacionService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
```
