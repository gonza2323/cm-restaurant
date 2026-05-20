package com.example.restaurant.empresa;

import com.example.restaurant.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Entity
@Getter
@Setter
@AllArgsConstructor
@SuperBuilder
@NoArgsConstructor
public class Empresa extends BaseEntity {
    @Column(nullable = false)
    private String nombre;

    private String telefono;

    private String correoElectronico;
}
