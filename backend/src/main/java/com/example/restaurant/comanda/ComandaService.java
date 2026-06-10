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
}
