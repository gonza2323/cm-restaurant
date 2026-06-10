package com.example.restaurant.resenia;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReseniaRepository extends JpaRepository<Resenia, Long> {

    @Query("""
    SELECT r FROM Resenia r
    JOIN FETCH r.cliente c
    JOIN FETCH c.usuario
    WHERE r.eliminado = false
""")
    List<Resenia> findAllWithClientInfo();
}
