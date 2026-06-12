package com.example.restaurant.carta;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
@RequestMapping("/api")
public class CartaController {
    private final CartaService cartaService;

    @GetMapping("/carta")
    public ResponseEntity<CartaDto> getCartaClientes() {
        CartaDto cartaDto = cartaService.getCartaWithItemsDisponibles();
        return ResponseEntity.ok(cartaDto);
    }

    @GetMapping("/mozos/carta")
//    @PreAuthorize("hasAnyRole('MOZO', 'ADMINISTRATIVO')") TODO QUITAR
    public ResponseEntity<CartaDto> getCartaMozos() {
        CartaDto cartaDto = cartaService.getCartaWithReservedStock();
        return ResponseEntity.ok(cartaDto);
    }
}
