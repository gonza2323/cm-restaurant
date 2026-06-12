package com.example.restaurant.carta;

import com.example.restaurant.comanda.ComandaRepository;
import com.example.restaurant.error.BusinessException;
import com.example.restaurant.service.BaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartaService extends BaseService<Carta, CartaRepository> {

    private final ItemCartaMapper itemCartaMapper;
    private final ComandaRepository comandaRepository;
    private final ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository;

    public CartaService(CartaRepository repo, ItemCartaMapper itemCartaMapper, ComandaRepository comandaRepository, ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository) {
        super("Carta", repo);
        this.itemCartaMapper = itemCartaMapper;
        this.comandaRepository = comandaRepository;
        this.articuloInventarioItemCartaRepository = articuloInventarioItemCartaRepository;
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

        List<ItemCarta> itemsDisponibles = repository.findItemsCartaDisponibles(carta.getId());

        return buildCartaDto(carta, itemsDisponibles);
    }

    @Transactional(readOnly = true)
    public CartaDto getCartaWithReservedStock() {
        CartaDto cartaDto = repository.findCurrentCarta(LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay una carta vigente"));

        // 1. Obtener conteos de ItemCarta en comandas abiertas
        List<Object[]> counts = comandaRepository.countItemsInOpenComandas();
        Map<Long, Long> itemCounts = counts.stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        // 2. Calcular stock reservado por artículo
        Map<Long, Double> reservedStock = new HashMap<>();
        if (!itemCounts.isEmpty()) {
            List<ArticuloInventarioItemCarta> ingredientsForReserved =
                    articuloInventarioItemCartaRepository.findByItemCartaIdInAndEliminadoFalse(itemCounts.keySet());

            for (ArticuloInventarioItemCarta aiic : ingredientsForReserved) {
                Long artId = aiic.getArticuloInventario().getId();
                Long itemCount = itemCounts.get(aiic.getItemCarta().getId());
                double totalReserved = (double) aiic.getCantidad() * itemCount;
                reservedStock.merge(artId, totalReserved, Double::sum);
            }
        }

        // 3. Obtener todos los items de la carta con su stock actual
        List<ItemCarta> allItems = repository.findAllItemsWithStock(cartaDto.getId());

        // 4. Filtrar items considerando el stock reservado
        List<ItemCarta> itemsDisponibles = allItems.stream()
                .filter(item -> {
                    // Si el item no tiene ingredientes, asumimos que está disponible (o no depende del inventario)
                    if (item.getArticulosInventario().isEmpty()) return true;

                    for (ArticuloInventarioItemCarta aiic : item.getArticulosInventario()) {
                        double actualStock = aiic.getArticuloInventario().getStock().getCantidadActual();
                        double reserved = reservedStock.getOrDefault(aiic.getArticuloInventario().getId(), 0.0);
                        // El stock disponible debe ser al menos lo necesario para una porción
                        if (actualStock - reserved < aiic.getCantidad()) {
                            return false;
                        }
                    }
                    return true;
                })
                .toList();

        return buildCartaDto(cartaDto, itemsDisponibles);
    }

    private CartaDto buildCartaDto(CartaDto carta, List<ItemCarta> items) {
        List<SeccionCartaDTO> secciones = repository.findSeccionesCarta(carta.getId());

        Map<Long, List<ItemCartaDto>> itemsPorSeccion = items.stream()
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
