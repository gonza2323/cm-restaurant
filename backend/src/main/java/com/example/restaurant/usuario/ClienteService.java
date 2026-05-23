package com.example.restaurant.usuario;

import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Transactional
    public Cliente create(ClienteCreateDto dto, Usuario usuario) {
        Cliente cliente = clienteMapper.toEntity(dto);
        cliente.setUsuario(usuario);
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Page<ClienteSummaryDto> findDtos(Pageable pageable) {
        return clienteRepository.buscarResumenClientes(pageable);
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
