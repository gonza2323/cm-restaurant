package com.example.restaurant.inventario;

import com.example.restaurant.repository.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnidadDeMedidaRepository extends BaseRepository<UnidadDeMedida> {
    Optional<UnidadDeMedida> findByNombre(String nombre);
}

