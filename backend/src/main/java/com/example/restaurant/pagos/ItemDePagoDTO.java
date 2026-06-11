package com.example.restaurant.pagos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ItemDePagoDTO {
    private Long id;
    private String nombre;
    private int cantidad;
    private double precioUnitario;
}
