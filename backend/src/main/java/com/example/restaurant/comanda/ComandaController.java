package com.example.restaurant.comanda;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
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
        // todo. No disponible si no hay platos. Debe tmb marcar cada detalle como enviado a cocina.
        // Pasar directamente al estado PREPARADO, no EN_COCINA o similar, para comanda y detalles, ya que no está implementado
        // el sistema de cocina. Debe descontar del sistema de stock al hacerlo.
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/marcar-entregada")
    public ResponseEntity<?> marcarEntregada(@PathVariable Long comandaId) {
        // todo. No disponible si no está preparada. tmb debe marcarse entregado cada plato.
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/detalles/{detalleId}/marcar-entregado")
    public ResponseEntity<?> mercarItemEntregado(@PathVariable Long comandaId, @PathVariable Long detalleId) {
        // todo. No disponible si plato no preparad. Si quedaron todos los platos preparados, marcar la comanda
        // como entregada tmb.
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/detalles")
    public ResponseEntity<?> addItemCarta(@PathVariable Long comandaId, @RequestBody AddItemCartaRequest request) {
        comandaService.addItemCarta(comandaId, request.itemCartaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{comandaId}/detalles/{detalleId}")
    public ResponseEntity<?> removerDetalle(@PathVariable Long comandaId, @PathVariable Long detalleId) {
        // todo. Solo dispnible si comanda en proceso de solicitud
        return ResponseEntity.ok().build();
    }

    private record ComandaCreateRequest(Long mesaId) {};
    private record AddItemCartaRequest(Long itemCartaId) {};
}
