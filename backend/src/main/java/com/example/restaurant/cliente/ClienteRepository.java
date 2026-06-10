package com.example.restaurant.cliente;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByIdAndEliminadoFalse(Long id);

    Optional<Cliente> findByUsuarioIdAndEliminadoFalse(Long userId);
}
