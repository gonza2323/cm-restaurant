package com.example.restaurant.entity;

import com.example.restaurant.enums.TipoDePago;
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
public class FormaDePago extends BaseEntity {

    private String observacion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoDePago tipoDePago;
}
