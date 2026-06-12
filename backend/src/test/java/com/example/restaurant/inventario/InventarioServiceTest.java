package com.example.restaurant.inventario;

import com.example.restaurant.carta.ArticuloInventarioItemCarta;
import com.example.restaurant.carta.ArticuloInventarioItemCartaRepository;
import com.example.restaurant.carta.ItemCarta;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventarioServiceTest {

    @Mock
    private ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository;
    @Mock
    private StockRepository stockRepository;
    @Mock
    private MovimientoStockRepository movimientoStockRepository;

    @InjectMocks
    private InventarioService inventarioService;

    private ItemCarta item1;
    private ItemCarta item2;
    private ArticuloInventario art1;
    private ArticuloInventario art2;

    @BeforeEach
    void setUp() {
        art1 = ArticuloInventario.builder().id(1L).nombre("Pan").stock(Stock.builder().cantidadActual(10.0).build()).build();
        art2 = ArticuloInventario.builder().id(2L).nombre("Carne").stock(Stock.builder().cantidadActual(5.0).build()).build();

        item1 = ItemCarta.builder().id(1L).nombre("Burger").build();
        item2 = ItemCarta.builder().id(2L).nombre("Hot Dog").build();
    }

    @Test
    void hayStockSuficiente_EmptyList_ReturnsTrue() {
        assertTrue(inventarioService.hayStockSuficiente(Collections.emptyList()));
        assertTrue(inventarioService.hayStockSuficiente(null));
    }

    @Test
    void hayStockSuficiente_Success() {
        ArticuloInventarioItemCarta aiic1 = ArticuloInventarioItemCarta.builder().articuloInventario(art1).cantidad(1).build();
        ArticuloInventarioItemCarta aiic2 = ArticuloInventarioItemCarta.builder().articuloInventario(art2).cantidad(1).build();

        when(articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(item1)).thenReturn(Arrays.asList(aiic1, aiic2));

        // 2 burgers = 2 pan (10 available), 2 carne (5 available). OK.
        assertTrue(inventarioService.hayStockSuficiente(Arrays.asList(item1, item1)));
        verify(articuloInventarioItemCartaRepository, times(1)).findByItemCartaAndEliminadoFalse(item1);
    }

    @Test
    void hayStockSuficiente_Insuficiente() {
        ArticuloInventarioItemCarta aiic1 = ArticuloInventarioItemCarta.builder().articuloInventario(art1).cantidad(1).build();
        ArticuloInventarioItemCarta aiic2 = ArticuloInventarioItemCarta.builder().articuloInventario(art2).cantidad(1).build();

        when(articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(item1)).thenReturn(Arrays.asList(aiic1, aiic2));

        // 6 burgers = 6 pan (10 available), 6 carne (5 available). Not enough carne.
        assertFalse(inventarioService.hayStockSuficiente(Arrays.asList(item1, item1, item1, item1, item1, item1)));
    }

    @Test
    void hayStockSuficiente_MultipleItemsCombined() {
        ArticuloInventarioItemCarta aiic1 = ArticuloInventarioItemCarta.builder().articuloInventario(art1).cantidad(1).build(); // 1 pan for burger
        ArticuloInventarioItemCarta aiic2 = ArticuloInventarioItemCarta.builder().articuloInventario(art1).cantidad(1).build(); // 1 pan for hotdog

        when(articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(item1)).thenReturn(Collections.singletonList(aiic1));
        when(articuloInventarioItemCartaRepository.findByItemCartaAndEliminadoFalse(item2)).thenReturn(Collections.singletonList(aiic2));

        // 5 burgers + 6 hotdogs = 11 pan. (10 available). Not enough pan.
        assertFalse(inventarioService.hayStockSuficiente(Arrays.asList(item1, item1, item1, item1, item1, item2, item2, item2, item2, item2, item2)));
    }
}
