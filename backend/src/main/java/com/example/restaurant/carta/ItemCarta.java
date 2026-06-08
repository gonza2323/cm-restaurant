package com.example.restaurant.carta;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.imagen.Imagen;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarta extends BaseEntity {
    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    private double precio;

    @ManyToOne
    private Imagen imagen;

    @ManyToOne
    private SeccionCarta seccion;

    @OneToMany(mappedBy = "itemCarta")
    private List<ArticuloInventarioItemCarta> articulosInventario = new ArrayList<>();
}
