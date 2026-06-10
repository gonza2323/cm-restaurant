package com.example.restaurant.mesa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    List<Mesa> findByEliminadoFalse();
    Optional<Mesa> findByIdAndEliminadoFalse(Long id);
}
