package com.example.restaurant.entity;

import com.example.restaurant.enums.TipoEmpleado;
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
public class Empleado extends BaseEntity {
    @ManyToOne(optional = false)
    private Persona persona;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoEmpleado tipoEmpleado;
}
