package com.example.restaurant.carta;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CartaController {
    private final CartaService cartaService;

    @GetMapping("/carta")
    public ResponseEntity<CartaDto> getCartaClientes() {
        CartaDto cartaDto = cartaService.getCartaWithItemsDisponibles();
        return ResponseEntity.ok(cartaDto);
    }

    @GetMapping("/mozos/carta")
    public ResponseEntity<CartaDto> getCartaMozos() {
        // TODO Cambiar query, deberia restar stock reservado por comandas abiertas
        CartaDto cartaDto = cartaService.getCartaWithItemsDisponibles();
        return ResponseEntity.ok(cartaDto);
    }
}
