package com.example.restaurant.inventario;

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
public class ArticuloInventario extends BaseEntity {
    @Column(nullable = false)
    private String nombre;

    @Lob
    private String descripcion;

    private boolean sinTAC;

    private boolean esIngrediente;

    @ManyToOne
    private UnidadDeMedida unidadDeMedida;

    @ManyToOne(optional = false)
    private Stock stock;

    @ManyToOne(fetch = FetchType.LAZY)
    private Imagen imagen;
}
