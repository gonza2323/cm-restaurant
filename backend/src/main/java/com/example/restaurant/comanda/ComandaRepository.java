package com.example.restaurant.comanda;

import com.example.restaurant.mesa.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    @Query("""
    SELECT c FROM Comanda c
    JOIN c.mesa m
    WHERE m = :mesa AND c.eliminado = false
""")
    List<Comanda> findAllByMesa(@Param("mesa") Mesa mesa);

    Comanda findByIdAndEliminadoFalse(Long id);
}
