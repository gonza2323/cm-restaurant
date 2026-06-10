package com.example.restaurant.cliente;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("""
SELECT DISTINCT new com.example.restaurant.cliente.ClienteSummaryDto(
    c.id, c.nombre, c.apellido, c.usuario.email
) FROM Cliente c
""")
    Page<ClienteSummaryDto> buscarResumenClientes(Pageable pageable);

    Optional<Cliente> findByIdAndEliminadoFalse(Long id);
}
