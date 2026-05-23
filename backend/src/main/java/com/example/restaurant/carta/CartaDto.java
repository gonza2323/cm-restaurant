package com.example.restaurant.carta;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class CartaDto {
    private Long id;
    private List<SeccionCartaDto> secciones = new ArrayList<>();

    public CartaDto(Long id) {
        this.id = id;
    }
}
