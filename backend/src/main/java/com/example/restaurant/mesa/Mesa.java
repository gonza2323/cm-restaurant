package com.example.restaurant.mesa;

import com.example.restaurant.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class Mesa extends BaseEntity {
    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoMesa estado;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(nullable = false)
    private String zona;
}
