package com.example.restaurant.mesa;

import com.example.restaurant.comanda.ComandaService;
import com.example.restaurant.comanda.ComandaSummaryViewDTO;
import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MesaService {
    private final MesaRepository repository;
    private final MesaMapper mapper;
    private final ComandaService comandaService;

    public List<MesaSummaryViewDTO> listAll() {
        List<Mesa> mesas = repository.findByEliminadoFalse();
        return mapper.toDTOs(mesas);
    }

    public MesaDetailViewDTO getDetails(Long mesaId) {
        Mesa mesa = repository.findByIdAndEliminadoFalse(mesaId)
                .orElseThrow(() -> new BusinessException("Mesa no encontrada"));

        MesaDetailViewDTO dto = mapper.toDetailDTO(mesa);

        List<ComandaSummaryViewDTO> comandas = comandaService.getComandasForMesa(mesa);

        dto.setComandas(comandas);
        return dto;
    }
}
