package com.example.restaurant.persona;

import com.example.restaurant.auth.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class MeController {
    private final PersonaService personaService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileDTO> getProfile(@AuthenticationPrincipal CurrentUser user) {
        ProfileDTO dto = personaService.getProfile(user.getId());
        return ResponseEntity.ok(dto);
    }
}
