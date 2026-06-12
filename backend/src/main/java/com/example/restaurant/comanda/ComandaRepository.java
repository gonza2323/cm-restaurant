package com.example.restaurant.comanda;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.mesa.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    @Query("""
    SELECT c FROM Comanda c
    JOIN c.mesa m
    WHERE m = :mesa AND c.eliminado = false
""")
    List<Comanda> findAllByMesa(@Param("mesa") Mesa mesa);

    Optional<Comanda> findByIdAndEliminadoFalse(Long id);

    @Query("""
    SELECT DISTINCT d FROM DetalleComanda d
    JOIN FETCH d.itemCarta
    JOIN FETCH d.comanda
    WHERE d.comanda.id IN :idsComandas
    AND d.eliminado = false
""")
    List<DetalleComanda> findDetallesByComandaIds(@Param("idsComandas") List<Long> idsComandas);

    @Query("""
    SELECT DISTINCT c FROM Comanda c
    WHERE c.id IN :idsComandas
    AND c.eliminado = false
""")
    List<Comanda> findAllByIds(List<Long> idsComandas);

    @Query("""
        SELECT d.itemCarta.id, COUNT(d.id)
        FROM DetalleComanda d
        WHERE d.comanda.estado = com.example.restaurant.comanda.EstadoComanda.EN_PROCESO_DE_SOLICITUD
        AND d.eliminado = false
        AND d.comanda.eliminado = false
        GROUP BY d.itemCarta.id
    """)
    List<Object[]> countItemsInOpenComandas();

    @Query("""
    SELECT aiic.articuloInventario.id, SUM(aiic.cantidad)
    FROM DetalleComanda dc
    JOIN dc.itemCarta ic
    JOIN ic.articulosInventario aiic
    WHERE dc.comanda.estado = 'EN_PROCESO_DE_SOLICITUD'
    AND dc.eliminado = false
    AND aiic.eliminado = false
    GROUP BY aiic.articuloInventario.id
""")
    List<Object[]> findStockReservadoEnComandasAbiertas();
}
