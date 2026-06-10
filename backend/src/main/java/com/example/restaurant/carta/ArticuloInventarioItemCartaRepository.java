package com.example.restaurant.carta;

import com.example.restaurant.repository.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloInventarioItemCartaRepository extends BaseRepository<ArticuloInventarioItemCarta> {
    List<ArticuloInventarioItemCarta> findByItemCartaAndEliminadoFalse(ItemCarta itemCarta);
}

