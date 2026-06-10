package com.example.restaurant.mesa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MesaSummaryViewDTO {
    private Long id;
    private Integer numero;
    private EstadoMesa estado;
    private Integer capacidad;
    private String zona;
}
