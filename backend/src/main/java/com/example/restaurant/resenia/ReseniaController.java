package com.example.restaurant.resenia;

import com.example.restaurant.auth.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
@RequestMapping("/api/resenias")
public class ReseniaController {
    private final ReseniaService reseniaService;

    @GetMapping
    public ResponseEntity<List<ReseniaViewDTO>> getResenias() {
        List<ReseniaViewDTO> resenias = reseniaService.listDtos();
        return ResponseEntity.ok(resenias);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE')")
    public ResponseEntity<Void> crear(
            @AuthenticationPrincipal CurrentUser user,
            @RequestBody ReseniaCreateRequest request) {
        reseniaService.create(user.getId(), request.observacion);
        return ResponseEntity.ok().build();
    }

    public record ReseniaCreateRequest(String observacion) {};
}
