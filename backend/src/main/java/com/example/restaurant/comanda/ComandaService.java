package com.example.restaurant.comanda;

import com.example.restaurant.error.BusinessException;
import com.example.restaurant.mesa.Mesa;
import com.example.restaurant.mesa.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComandaService {
    private final ComandaRepository repository;
    private final ComandaMapper mapper;
    private final MesaRepository mesaRepository;

    public List<ComandaSummaryViewDTO> getComandasForMesa(Mesa mesa) {
        List<Comanda> comandas = repository.findAllByMesa(mesa);
        return mapper.toDTOs(comandas);
    }

    public ComandaDetailViewDTO getDetails(Long comandaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId);
        ComandaDetailViewDTO dto = mapper.toDetailDTO(comanda);

        // TODO
        List<DetalleComandaViewDTO> detalles = List.of();

        dto.setDetalles(detalles);
        return dto;
    }

    @Transactional
    public Comanda create(Long mesaId) {
        Mesa mesa = mesaRepository.findByIdAndEliminadoFalse(mesaId)
                .orElseThrow(() -> new BusinessException("Mesa no encontrada"));

        Comanda comanda = Comanda.builder()
                .fechaSolicitud(LocalDate.now())
                .estado(EstadoComanda.ABIERTA)
                .mesa(mesa)
                .build();
        return repository.save(comanda);
    }
}
