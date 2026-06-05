package com.example.restaurant.carta;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carta")
@CrossOrigin(origins = "http://localhost:5173")

public class CartaController {
    private final CartaService cartaService;

    @GetMapping("/me")
    public ResponseEntity<CartaDto> getCarta() {
        CartaDto cartaDto = cartaService.getCartaWithItemsDisponibles();
        return ResponseEntity.ok(cartaDto);
    }
}
