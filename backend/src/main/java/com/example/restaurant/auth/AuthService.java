package com.example.restaurant.auth;

import com.example.restaurant.usuario.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final ClienteFacade clienteFacade;

    public CustomUserDetails loginWithEmailPassword(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        return (CustomUserDetails) authentication.getPrincipal();
    }

    public CurrentUser registerUserWithEmailAndPassword(SignUpFormDto signUpFormDto) {
        Usuario usuario = clienteFacade.registrarClientePorFormularioRegistro(signUpFormDto);
        return new CurrentUser(usuario.getId(), List.of(usuario.getRol()));
    }
}
