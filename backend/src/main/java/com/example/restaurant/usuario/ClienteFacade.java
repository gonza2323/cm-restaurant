package com.example.restaurant.usuario;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteFacade {

    private final UsuarioService usuarioService;
    private final ClienteService clienteService;

    @Transactional
    public Usuario registrarClientePorFormularioRegistro(SignUpFormDto request) {
        return usuarioService.createUserFromEmailPassword(request.getEmail(), request.getPassword(), request.getPasswordConfirm());
    }

    public void borrarCliente(Long id) {
        // todo falta imagen

        Cliente cliente = clienteService.delete(id);
        usuarioService.delete(cliente.getUsuario());
    }
}
