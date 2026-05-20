package com.example.restaurant.inventario;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloInventarioItemCarta extends BaseEntity {
    private int cantidad;

    @ManyToOne(optional = false)
    private ArticuloInventario articuloInventario;
    
    @ManyToOne(optional = false)
    private ItemCarta itemCarta;
}
