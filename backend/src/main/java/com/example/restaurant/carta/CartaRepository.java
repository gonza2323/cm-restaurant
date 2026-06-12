package com.example.restaurant.carta;

import com.example.restaurant.repository.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CartaRepository extends BaseRepository<Carta> {
    @Query("""
    SELECT new com.example.restaurant.carta.CartaDto(c.id)
    FROM Carta c
    WHERE c.eliminado = false
    AND (c.fechaDesde <= :now)
    AND (c.fechaHasta >= :now)
""")
    Optional<CartaDto> findCurrentCarta(@Param("now") LocalDate now);

    @Query("""
    SELECT new com.example.restaurant.carta.SeccionCartaDTO(s.id, s.nombre)
    FROM SeccionCarta s
    JOIN s.carta m
    WHERE m.id = :cartaId
    AND s.eliminado = false
""")
    List<SeccionCartaDTO> findSeccionesCarta(@Param("cartaId") Long cartaId);

    @Query("""
    SELECT i FROM ItemCarta i
    JOIN i.seccion s
    JOIN i.articulosInventario miii
    JOIN miii.articuloInventario articulo
    JOIN articulo.stock stock
    WHERE s.carta.id = :cartaId
    AND i.eliminado = false
    GROUP BY i.id, i.nombre, i.descripcion, i.precio, s.id
    HAVING MIN(stock.cantidadActual - miii.cantidad) >= 0
""")
    List<ItemCarta> findItemsCartaDisponibles(@Param("cartaId") Long cartaId);

    @Query("""
        SELECT DISTINCT i FROM ItemCarta i
        JOIN i.seccion s
        LEFT JOIN FETCH i.articulosInventario aiic
        LEFT JOIN FETCH aiic.articuloInventario art
        LEFT JOIN FETCH art.stock
        WHERE s.carta.id = :cartaId
        AND i.eliminado = false
    """)
    List<ItemCarta> findAllItemsWithStock(@Param("cartaId") Long cartaId);
}
