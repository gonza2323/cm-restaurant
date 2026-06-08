package com.example.restaurant.usuario;

import com.example.restaurant.config.AppProperties;
import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties properties;
    private final UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public Usuario find(Long id) {
        return repository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public UsuarioDetailDto findDto(Long id) {
        return usuarioMapper.toDto(find(id));
    }

    // solo clientes
    @Transactional
    public Usuario createUserFromEmailPassword(String email, String password, String passwordConfirm) {
        validarEmail(email);
        validarClave(password, passwordConfirm);

        String passwordHash = passwordEncoder.encode(password);

        Usuario usuario = Usuario.builder()
                .email(email)
                .password(passwordHash)
                .rol(UserRole.CLIENTE)
                .build();

        return repository.save(usuario);
    }

    private void validarClave(String password, String passwordConfirm) {
        if (!password.equals(passwordConfirm))
            throw new BusinessException("Las contraseñas no coinciden");
    }

    private void validarEmail(String nombre) {
        boolean taken = repository.existsByEmailAndEliminadoFalse(nombre);
        if (taken)
            throw new BusinessException("El email de usuario ya está en uso");
    }

    public void delete(Usuario usuario) {
        usuario.setEliminado(true);
    }
}
