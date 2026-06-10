package com.example.restaurant.carta;

import com.example.restaurant.repository.BaseRepository;

import java.util.Optional;

public interface ItemCartaRepository extends BaseRepository<ItemCarta> {
    Optional<ItemCarta> findByIdAndEliminadoFalse(Long id);
}
