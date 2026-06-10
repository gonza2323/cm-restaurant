package com.example.restaurant.empleado;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    Optional<Empleado> findByIdAndEliminadoFalse(Long id);
}
