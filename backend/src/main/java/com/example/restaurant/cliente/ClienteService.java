package com.example.restaurant.cliente;

import com.example.restaurant.error.BusinessException;
import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.usuario.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Transactional
    public Cliente create(ClienteCreateDto dto, Usuario usuario) {
        return create(dto, usuario, null);
    }

    @Transactional
    public Cliente create(ClienteCreateDto dto, Usuario usuario, Imagen imagen) {
        Cliente cliente = clienteMapper.toEntity(dto);
        cliente.setUsuario(usuario);
        if (imagen != null) {
            cliente.setImagen(imagen);
        }
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Cliente find(Long id) {
        return clienteRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new BusinessException("Cliente no encontrado"));
    }

    @Transactional
    public Cliente delete(Long id) {
        Cliente cliente = find(id);
        cliente.setEliminado(true);
        return clienteRepository.save(cliente);
    }
}
