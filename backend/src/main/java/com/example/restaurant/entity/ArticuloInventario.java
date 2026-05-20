package com.example.restaurant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
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
public class ArticuloInventario extends BaseEntity {
    @Column(nullable = false)
    private String nombre;

    @Lob
    private String descripcion;

    private boolean sinTAC;

    private boolean esIngrediente;

    @ManyToOne
    private UnidadDeMedida unidadDeMedida;

    @ManyToOne
    private Imagen imagen;
}
