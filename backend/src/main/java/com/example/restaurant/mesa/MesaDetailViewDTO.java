package com.example.restaurant.mesa;

import com.example.restaurant.comanda.ComandaSummaryViewDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MesaDetailViewDTO {
    private Long id;
    private Integer numero;
    private EstadoMesa estado;
    private Integer capacidad;
    private String zona;

    private List<ComandaSummaryViewDTO> comandas;
}
