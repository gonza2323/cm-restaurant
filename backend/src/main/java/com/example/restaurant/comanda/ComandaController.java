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
        // todo
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/marcar-entregada")
    public ResponseEntity<?> marcarEntregada(@PathVariable Long comandaId) {
        // todo
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/detalles/{detalleId}/marcar-entregado")
    public ResponseEntity<?> marcarEntregada(@PathVariable Long comandaId, @PathVariable Long detalleId) {
        // todo
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{comandaId}/items")
    public ResponseEntity<?> addItemCarta(@PathVariable Long comandaId, @RequestBody ComandaCreateRequest request) {
        // todo
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{comandaId}/items")
    public ResponseEntity<?> removeItemCarta(@PathVariable Long comandaId, @RequestBody ComandaCreateRequest request) {
        // todo
        return ResponseEntity.ok().build();
    }

    private record ComandaCreateRequest(Long mesaId) {};
    private record AddItemCartaRequest(Long itemCartaId) {};
}
