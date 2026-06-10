package com.example.restaurant.comanda;

import com.example.restaurant.mesa.Mesa;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComandaService {
    private final ComandaRepository repository;
    private final ComandaMapper mapper;

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
}
