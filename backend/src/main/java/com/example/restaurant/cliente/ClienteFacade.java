package com.example.restaurant.cliente;

import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.imagen.ImagenService;
import com.example.restaurant.imagen.ImageData;
import com.example.restaurant.imagen.TipoImagen;
import com.example.restaurant.usuario.UserRole;
import com.example.restaurant.usuario.Usuario;
import com.example.restaurant.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteFacade {

    private final UsuarioService usuarioService;
    private final ClienteService clienteService;
    private final ClienteMapper clienteMapper;
    private final ImagenService imagenService;

    @Transactional
    public Cliente registarCliente(ClienteCreateRequestDto request, ImageData imageData) {
        Imagen imagen = null;
        if (imageData != null) {
            imagen = imagenService.createFromImageData(imageData, TipoImagen.PERSONA);
        }

        Usuario usuario = usuarioService.createUserFromEmailPassword(
                request.getEmail(),
                request.getPassword(),
                request.getPasswordConfirm(),
                UserRole.CLIENTE);

        ClienteCreateDto clienteDto = clienteMapper.toDto(request);
        return clienteService.create(clienteDto, usuario, imagen);
    }

    public void borrarCliente(Long id) {

        Cliente cliente = clienteService.delete(id);
        usuarioService.delete(cliente.getUsuario());
    }
}
