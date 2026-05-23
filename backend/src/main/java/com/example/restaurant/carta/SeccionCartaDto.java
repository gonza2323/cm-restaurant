package com.example.restaurant.carta;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SeccionCartaDto {
    private Long id;
    private String nombre;
    private List<ItemCartaDto> items = new ArrayList<>();

    public SeccionCartaDto(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
