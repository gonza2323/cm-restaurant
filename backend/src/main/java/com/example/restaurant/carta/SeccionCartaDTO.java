package com.example.restaurant.carta;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SeccionCartaDTO {
    private Long id;
    private String nombre;
    private List<ItemCartaDto> items = new ArrayList<>();

    public SeccionCartaDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}
