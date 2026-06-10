package com.example.restaurant.comanda;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.mesa.Mesa;
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

    @ManyToOne(optional = false)
    private Mesa mesa;

    @OneToMany(mappedBy = "comanda", cascade = CascadeType.PERSIST)
    private List<DetalleComanda> detalles = new ArrayList<>();
}
