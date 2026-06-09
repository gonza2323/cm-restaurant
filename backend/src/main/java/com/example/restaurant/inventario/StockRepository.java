package com.example.restaurant.inventario;

import com.example.restaurant.repository.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends BaseRepository<Stock> {
}

