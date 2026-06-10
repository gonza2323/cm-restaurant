package com.example.restaurant.inventario;

import com.example.restaurant.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoStock extends BaseEntity {
    private double cantidad;

    private String motivo;

    @Column(nullable = false)
    private TipoMovimientoStock tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne(optional = false)
    private Stock stock;
}
