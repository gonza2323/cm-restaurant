package com.example.restaurant.comanda;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.carta.ItemCartaRepository;
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
    private final ItemCartaRepository itemCartaRepository;
    private final DetalleComandaRepository detalleComandaRepository;

    public List<ComandaSummaryViewDTO> getComandasForMesa(Mesa mesa) {
        List<Comanda> comandas = repository.findAllByMesa(mesa);
        return mapper.toDTOs(comandas);
    }

    public ComandaDetailViewDTO getDetails(Long comandaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        ComandaDetailViewDTO dto = mapper.toDetailDTO(comanda);

        List<DetalleComanda> detalles = detalleComandaRepository.getDetallesOfComanda(comanda);
        List<DetalleComandaViewDTO> detallesDTOs = mapper.toDetallesDTOs(detalles);

        dto.setDetalles(detallesDTOs);
        return dto;
    }

    @Transactional
    public Comanda create(Long mesaId) {
        Mesa mesa = mesaRepository.findByIdAndEliminadoFalse(mesaId)
                .orElseThrow(() -> new BusinessException("Mesa no encontrada"));

        Comanda comanda = Comanda.builder()
                .fechaSolicitud(LocalDate.now())
                .estado(EstadoComanda.EN_PROCESO_DE_SOLICITUD)
                .mesa(mesa)
                .build();
        return repository.save(comanda);
    }

    @Transactional
    public void addItemCarta(Long comandaId, Long itemCartaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        ItemCarta itemCarta = itemCartaRepository.findByIdAndEliminadoFalse(itemCartaId)
                .orElseThrow(() -> new BusinessException("Item de carta no encontrado"));

        DetalleComanda detalle = DetalleComanda.builder()
                .comanda(comanda)
                .itemCarta(itemCarta)
                .estado(EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD)
                .build();

        detalleComandaRepository.save(detalle);
    }
}
