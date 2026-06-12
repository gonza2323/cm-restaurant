package com.example.restaurant.inventario;

import com.example.restaurant.carta.ArticuloInventarioItemCarta;
import com.example.restaurant.carta.ArticuloInventarioItemCartaRepository;
import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.comanda.ComandaRepository;
import com.example.restaurant.comanda.EstadoComanda;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventarioService {
    private final ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository;
    private final StockRepository stockRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final ComandaRepository comandaRepository;

    @Transactional
    public void descontarStock(ItemCarta itemCarta) {
        List<ArticuloInventarioItemCarta> articulos = articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(itemCarta);

        for (ArticuloInventarioItemCarta aiic : articulos) {
            ArticuloInventario articulo = aiic.getArticuloInventario();
            Stock stock = articulo.getStock();

            double cantidadADescontar = aiic.getCantidad();
            stock.setCantidadActual(stock.getCantidadActual() - cantidadADescontar);
            stockRepository.save(stock);

            MovimientoStock movimiento = MovimientoStock.builder()
                    .cantidad(cantidadADescontar)
                    .tipo(TipoMovimientoStock.SALIDA)
                    .fecha(LocalDate.now())
                    .stock(stock)
                    .motivo(itemCarta.getNombre())
                    .build();
            movimientoStockRepository.save(movimiento);
        }
    }

    public boolean hayStockSuficiente(List<ItemCarta> itemsCarta) {
        if (itemsCarta == null || itemsCarta.isEmpty()) {
            return true;
        }

        // Agrupar por ItemCarta para manejar duplicados
        Map<Long, Long> itemCounts = new HashMap<>();
        Map<Long, ItemCarta> itemCartaMap = new HashMap<>();
        for (ItemCarta item : itemsCarta) {
            itemCounts.merge(item.getId(), 1L, Long::sum);
            itemCartaMap.putIfAbsent(item.getId(), item);
        }

        // Acumular la cantidad total requerida de cada ArticuloInventario
        Map<Long, Double> totalRequeridoPerArticulo = new HashMap<>();
        Map<Long, ArticuloInventario> articulosMap = new HashMap<>();

        for (Map.Entry<Long, Long> entry : itemCounts.entrySet()) {
            Long itemCartaId = entry.getKey();
            Long quantityOrdered = entry.getValue();
            ItemCarta itemCarta = itemCartaMap.get(itemCartaId);

            List<ArticuloInventarioItemCarta> articulos =
                    articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(itemCarta);

            for (ArticuloInventarioItemCarta aiic : articulos) {
                ArticuloInventario articulo = aiic.getArticuloInventario();
                double cantidadNecesaria = (double) aiic.getCantidad() * quantityOrdered;

                totalRequeridoPerArticulo.merge(articulo.getId(), cantidadNecesaria, Double::sum);
                articulosMap.putIfAbsent(articulo.getId(), articulo);
            }
        }

        Map<Long, Double> stockReservado = new HashMap<>();
        for (Object[] row : comandaRepository.findStockReservadoEnComandasAbiertas()) {
            stockReservado.put((Long) row[0], ((Number) row[1]).doubleValue());
        }

        // Validar stock disponible = cantidadActual - reservado >= requerido
        for (Map.Entry<Long, Double> entry : totalRequeridoPerArticulo.entrySet()) {
            Long articuloId = entry.getKey();
            Double cantidadNecesaria = entry.getValue();
            ArticuloInventario articulo = articulosMap.get(articuloId);

            double stockActual = articulo.getStock().getCantidadActual();
            double reservado = stockReservado.getOrDefault(articuloId, 0.0);
            double stockDisponible = stockActual - reservado;

            if (stockDisponible < cantidadNecesaria) {
                return false;
            }
        }

        return true;
    }
}
