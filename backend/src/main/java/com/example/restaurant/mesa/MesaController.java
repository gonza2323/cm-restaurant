package com.example.restaurant.mesa;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
//@PreAuthorize("hasAnyRole('MOZO', 'ADMINISTRATIVO')") TODO QUITAR
@EnableMethodSecurity(prePostEnabled = true)
@RequestMapping("/api/mesas")
public class MesaController {
    private final MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaSummaryViewDTO>> getMesas() {
        List<MesaSummaryViewDTO> mesas = mesaService.listAll();
        return ResponseEntity.ok(mesas);
    }

    @GetMapping("/{mesaId}")
    public ResponseEntity<MesaDetailViewDTO> getMesa(@PathVariable("mesaId") Long mesaId) {
        MesaDetailViewDTO mesa = mesaService.getDetails(mesaId);
        return ResponseEntity.ok(mesa);
    }
}
