package com.example.restaurant.carta;

import com.example.restaurant.error.BusinessException;
import com.example.restaurant.service.BaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartaService extends BaseService<Carta, CartaRepository> {

    private final ItemCartaMapper itemCartaMapper;

    public CartaService(CartaRepository repo, ItemCartaMapper itemCartaMapper) {
        super("Carta", repo);
        this.itemCartaMapper = itemCartaMapper;
    }

    public Carta create(LocalDate desde, LocalDate hasta) {
        Carta carta = Carta.builder()
                .fechaDesde(desde)
                .fechaHasta(hasta)
                .build();

        return repository.save(carta);
    }

    @Transactional(readOnly = true)
    public CartaDto getCartaWithItemsDisponibles() {
        CartaDto carta = repository.findCurrentCarta(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una carta vigente"));

        List<SeccionCartaDTO> secciones = repository.findSeccionesCarta(carta.getId());

        List<ItemCarta> itemsDisponibles = repository.findItemsCartaDisponibles(carta.getId());

        Map<Long, List<ItemCartaDto>> itemsPorSeccion = itemsDisponibles.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getSeccion().getId(),
                        Collectors.mapping(itemCartaMapper::toDto, Collectors.toList())
                ));

        secciones.forEach(seccion ->
                seccion.setItems(itemsPorSeccion.getOrDefault(seccion.getId(), List.of())));

        carta.setSecciones(secciones);

        return carta;
    }
}
