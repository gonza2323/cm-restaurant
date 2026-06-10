package com.example.restaurant.comanda;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComandaDetailViewDTO {
    private Long id;
    private LocalDate fechaSolicitud;
    private EstadoComanda estado;
    private List<DetalleComandaViewDTO> detalles;
}
