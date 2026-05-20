package com.example.restaurant.factura;

import com.example.restaurant.entity.BaseEntity;
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
public class Factura extends BaseEntity {

    @Column(nullable = false)
    private Long numeroFactura;

    @Column(nullable = false)
    private LocalDate fechaFactura;

    @Column(nullable = false)
    private Double totalPagado;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoFactura estado;

    @ManyToOne(cascade = CascadeType.PERSIST, optional = false)
    private FormaDePago formaDePago;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.PERSIST)
    private List<DetalleFactura> detalles = new ArrayList<>();
}
