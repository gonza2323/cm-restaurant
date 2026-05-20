package com.example.restaurant.entity;

import com.example.restaurant.enums.TipoImagen;
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
public class Imagen extends BaseEntity{

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String mime;

    @Lob
    @Column(nullable = false)
    private byte[] contenido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoImagen tipoImagen;
}
