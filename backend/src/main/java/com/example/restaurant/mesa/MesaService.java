package com.example.restaurant.mesa;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MesaService {
    private final MesaRepository repository;
    private final MesaMapper mapper;

    public List<MesaDTO> listAll() {
        List<Mesa> mesas = repository.findByEliminadoFalse();
        return mapper.toDTOs(mesas);
    }
}
