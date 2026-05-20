package com.example.restaurant.carta;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.imagen.Imagen;
import jakarta.persistence.*;
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
public class ItemCarta extends BaseEntity {
    private double precio;

    @ManyToOne
    private Imagen imagen;

    @ManyToOne
    private SeccionCarta seccion;
}
