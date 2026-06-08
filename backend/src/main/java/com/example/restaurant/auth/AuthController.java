package com.example.restaurant.auth;

import com.example.restaurant.usuario.SignUpFormDto;
import com.example.restaurant.usuario.Usuario;
import com.example.restaurant.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@EnableMethodSecurity(prePostEnabled = true)
public class AuthController {

    private final AccessTokenService accessTokenService;
    private final UsuarioService usuarioService;
    private final AuthService authService;

    @PostMapping("/login")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        CustomUserDetails user = authService.loginWithEmailPassword(loginRequest);

        Usuario usuario = usuarioService.find(user.getId());
        AccessTokenDto accessToken = accessTokenService.createToken(user.getId(), user.getRoles());

        LoginResponseDto response = LoginResponseDto.builder()
                .token(accessToken)
                .user(new AuthUserDto(user.getId(), user.getRoles()))
                .build();

        return ResponseEntity.ok()
                .body(response);
    }

    @PostMapping("/signup")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<LoginResponseDto> signup(@RequestBody SignUpFormDto loginRequest) {
        CurrentUser user = authService.registerUserWithEmailAndPassword(loginRequest);

        Usuario usuario = usuarioService.find(user.getId());
        AccessTokenDto accessToken = accessTokenService.createToken(user.getId(), user.getRoles());

        LoginResponseDto response = LoginResponseDto.builder()
                .token(accessToken)
                .user(new AuthUserDto(user.getId(), user.getRoles()))
                .build();

        return ResponseEntity.ok()
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok()
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserDto> authStatus(@AuthenticationPrincipal CurrentUser user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioService.find(user.getId());

        return ResponseEntity.ok(new AuthUserDto(user.getId(), user.getRoles()));
    }
}
