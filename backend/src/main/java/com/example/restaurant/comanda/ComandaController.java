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

    private record ComandaCreateRequest(Long mesaId) {};
}
