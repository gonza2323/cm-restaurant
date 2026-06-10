package com.example.restaurant.comanda;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comandas")
public class ComandaController {
    private final ComandaService comandaService;

    @GetMapping("/{comandaId}")
    public ResponseEntity<ComandaDetailViewDTO> getMesa(@PathVariable("comandaId") Long comandaId) {
        ComandaDetailViewDTO comanda = comandaService.getDetails(comandaId);
        return ResponseEntity.ok(comanda);
    }
}
