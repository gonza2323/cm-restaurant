package com.example.restaurant.resenia;

import com.example.restaurant.cliente.Cliente;
import com.example.restaurant.cliente.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReseniaService {
    private final ReseniaRepository reseniaRepository;
    private final ClienteService clienteService;
    private final ReseniaMapper reseniaMapper;

    @Transactional
    public void create(Long userId, String observacion) {
        Cliente cliente = clienteService.findByUserId(userId);

        Resenia resenia = Resenia.builder()
                .fecha(LocalDate.now())
                .observacion(observacion)
                .cliente(cliente)
                .build();

        reseniaRepository.save(resenia);
    }

    @Transactional(readOnly = true)
    public List<ReseniaViewDTO> listDtos() {
        List<Resenia> resenias = reseniaRepository.findAllWithClientInfo();
        return reseniaMapper.toDTOs(resenias);
    }
}
