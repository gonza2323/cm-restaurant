package com.example.restaurant.inventario;

import com.example.restaurant.carta.ArticuloInventarioItemCarta;
import com.example.restaurant.carta.ArticuloInventarioItemCartaRepository;
import com.example.restaurant.carta.ItemCarta;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioService {
    private final ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository;
    private final StockRepository stockRepository;
    private final MovimientoStockRepository movimientoStockRepository;

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
}
