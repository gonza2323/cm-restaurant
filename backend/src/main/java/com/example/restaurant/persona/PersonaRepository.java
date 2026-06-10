package com.example.restaurant.persona;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByUsuarioIdAndEliminadoFalse(Long usuarioId);

    Optional<Persona> findByIdAndEliminadoFalse(Long personaId);
}
