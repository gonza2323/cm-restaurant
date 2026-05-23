package com.example.restaurant.usuario;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteFacade {

    private final UsuarioService usuarioService;
    private final ClienteService clienteService;
    private final ClienteMapper clienteMapper;

    @Transactional
    public Usuario registrarClientePorFormularioRegistro(SignUpFormDto request) {
        return usuarioService.createUserFromEmailPassword(request.getEmail(), request.getPassword(), request.getPasswordConfirm());
    }

    @Transactional
    public Long registrarClientePorFormularioAdmin(ClienteCreateRequestDto request) {
        // todo falta imagen

        Usuario usuario = usuarioService.createUserNoPassword(request.getEmail(), UserRole.CLIENTE);

        ClienteCreateDto clienteDto = clienteMapper.toDto(request);
        Cliente cliente = clienteService.create(clienteDto, usuario);
        return cliente.getId();
    }

    public void borrarCliente(Long id) {
        // todo falta imagen

        Cliente cliente = clienteService.delete(id);
        usuarioService.delete(cliente.getUsuario());
    }
}
