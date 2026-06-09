package com.example.restaurant.mesa;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mesas")
public class MesaController {
    private final MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaDTO>> getMesas() {
        List<MesaDTO> mesas = mesaService.listAll();
        return ResponseEntity.ok(mesas);
    }
}
