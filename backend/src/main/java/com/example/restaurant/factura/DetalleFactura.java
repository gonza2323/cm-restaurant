package com.example.restaurant.factura;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.comanda.DetalleComanda;
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
public class DetalleFactura extends BaseEntity {

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double subtotal;

    @ManyToOne(cascade = CascadeType.PERSIST, optional = false)
    private Factura factura;

    @ManyToOne(optional = false)
    private DetalleComanda detalleComanda;
}
