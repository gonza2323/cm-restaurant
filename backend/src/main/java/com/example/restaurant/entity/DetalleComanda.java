package com.example.restaurant.entity;

import com.example.restaurant.enums.EstadoDetalleComanda;
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
public class DetalleComanda extends BaseEntity {
    private int cantidad;

    EstadoDetalleComanda estado;

    @ManyToOne(optional = false)
    private ItemCarta itemCarta;

    @ManyToOne(optional = false)
    private Comanda comanda;
}
