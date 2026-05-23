package com.example.restaurant.carta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCartaDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imageUrl;
}
