package com.example.restaurant.comanda;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComandaSummaryViewDTO {
    private Long id;
    private LocalDate fechaSolicitud;
    private EstadoComanda estado;
}
