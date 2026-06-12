package com.example.restaurant.comanda;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MOZO', 'ADMINISTRATIVO')")
@EnableMethodSecurity(prePostEnabled = true)
@RequestMapping("/api/comandas")
public class ComandaController {
    private final ComandaService comandaService;

    @GetMapping("/{comandaId}")
    public ResponseEntity<ComandaDetailViewDTO> getComanda(@PathVariable("comandaId") Long comandaId) {
        ComandaDetailViewDTO comanda = comandaService.getDetails(comandaId);
        return ResponseEntity.ok(comanda);
    }

    @PostMapping
    public ResponseEntity<ComandaDetailViewDTO> createComanda(@RequestBody ComandaCreateRequest request) {
        Comanda comanda = comandaService.create(request.mesaId);
        ComandaDetailViewDTO dto = comandaService.getDetails(comanda.getId());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{comandaId}/enviar-a-cocina")
    public ResponseEntity<?> enviarACocina(@PathVariable Long comandaId) {
        comandaService.enviarACocina(comandaId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/marcar-entregada")
    public ResponseEntity<?> marcarEntregada(@PathVariable Long comandaId) {
        comandaService.marcarEntregada(comandaId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/detalles/{detalleId}/marcar-entregado")
    public ResponseEntity<?> mercarItemEntregado(@PathVariable Long comandaId, @PathVariable Long detalleId) {
        comandaService.marcarItemEntregado(comandaId, detalleId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/detalles")
    public ResponseEntity<?> addItemCarta(@PathVariable Long comandaId, @RequestBody AddItemCartaRequest request) {
        comandaService.addItemCarta(comandaId, request.itemCartaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{comandaId}/detalles/{detalleId}")
    public ResponseEntity<?> removerDetalle(@PathVariable Long comandaId, @PathVariable Long detalleId) {
        comandaService.removerDetalle(comandaId, detalleId);
        return ResponseEntity.ok().build();
    }

    private record ComandaCreateRequest(Long mesaId) {};
    private record AddItemCartaRequest(Long itemCartaId) {};
}
