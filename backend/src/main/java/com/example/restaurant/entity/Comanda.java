package com.example.restaurant.entity;

import com.example.restaurant.enums.EstadoComanda;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Comanda extends BaseEntity {
    @Column(nullable = false)
    private LocalDate fechaSolicitud;

    private LocalDate fechaEntrega;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoComanda estado;

    @ManyToOne
    private Cliente cliente; // TODO: Cómo y cuándo se carga esto si es en el restaurante?

    @OneToMany(mappedBy = "comanda", cascade = CascadeType.PERSIST)
    private List<DetalleComanda> detalles = new ArrayList<>();
}
