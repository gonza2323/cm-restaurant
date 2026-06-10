package com.example.restaurant.comanda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetalleComandaRepository extends JpaRepository<DetalleComanda, Long> {
    @Query("""
    SELECT d FROM DetalleComanda d
    JOIN FETCH d.itemCarta
    WHERE d.comanda = :comanda AND d.eliminado = false
""")
    List<DetalleComanda> getDetallesOfComanda(@Param("comanda") Comanda comanda);

    Optional<DetalleComanda> findByIdAndComandaAndEliminadoFalse(Long id, Comanda comanda);
}
